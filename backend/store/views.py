from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from .models import Product,Category,Cart,CartItem,Order,OrderItem
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import AdressSerializer, CategorySerializer,ProductSerializer,CartItemSerializer,CartSerializer,RegisterSerializer,UserSerializer
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .tokens import password_reset_token
from .serializers import ForgotPasswordSerializer,ResetPasswordSerializer
from django.db import transaction
from django.db.models import F
from django.core.paginator import Paginator
from .models import Address
from dotenv import load_dotenv
load_dotenv()
import os
from django.core.mail import send_mail
from django.conf import settings
FRONTEND_URL = os.getenv("frontend_url")
from .tasks import send_order_confirmation_email






@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()

    slug = request.query_params.get("category")
    search = request.query_params.get("search")
    ordering = request.query_params.get("ordering")
    page_number = request.query_params.get("page", 1)

    # FILTER
    if slug:
        products = products.filter(category__slug=slug) #when you write category__slug its mean product.category.slug

    # SEARCH (multiple words)
    if search:
        words = search.strip().split()
        query = Q()
        for word in words:
            query = query | Q(name__icontains=word)
        products = products.filter(query).distinct()

    # SORTING
    allowed_ordering = ['price', '-price', 'created_at', '-created_at']
    if ordering in allowed_ordering:
        products = products.order_by(ordering)

    # PAGINATION
    paginator = Paginator(products, 4)  # 4 products per page
    page_obj = paginator.get_page(page_number)

    serializer = ProductSerializer(page_obj, many=True)

    return Response({
        "count": paginator.count,
        "total_pages": paginator.num_pages,
        "current_page": page_obj.number,
        "results": serializer.data
    }, status=status.HTTP_200_OK)




@api_view(['GET'])
def get_categories(request):
    products= Category.objects.all()
    serializer = CategorySerializer(products,many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_product_details(request,pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product ,context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart,created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart,created = Cart.objects.get_or_create(user=request.user)
    item,created = CartItem.objects.get_or_create(cart=cart , product=product)
    if not created:
        item.quantity+=1
        item.save()
    return Response({"message":"product was added to cart","cart": CartSerializer(cart).data
})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get("item_id")
    quantity = request.data.get("quantity")

    if item_id is None or quantity is None:
        return Response(
            {"error": "item_id and quantity are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        item = CartItem.objects.get(id=item_id)

        if int(quantity) < 1:
            item.delete()
        else:
            item.quantity = quantity
            item.save()

        cart = item.cart
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    except CartItem.DoesNotExist:
        return Response(
            {"error": "Cart item not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({"message":"product was removed from cart"})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):

    try:
        address_id = request.data.get("address_id")
        payment_method = request.data.get("payment_method", "COD")

        if not address_id:
            return Response(
                {"error": "address_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            address = Address.objects.get(
                id=address_id,
                user=request.user
            )
        except Address.DoesNotExist:
            return Response(
                {"error": "Invalid address"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart, created = Cart.objects.get_or_create(user=request.user)

        if not cart.items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            total = 0

            # LOCK PRODUCTS FIRST
            # we use select_related to fetch related product data in cartitems
            cart_items = cart.items.select_related('product')

            for item in cart_items:
                product = Product.objects.select_for_update().get(id=item.product.id)

                available_stock = product.stock - product.reserved_stock

                if available_stock < item.quantity:
                    return Response(
                        {"error": f"Insufficient stock for {product.name}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            #  CREATE ORDER
            order = Order.objects.create(
                user=request.user,
                address=address,
                payment_method=payment_method,
                total_amount=0,
                status="PENDING"
            )

            # RESERVE STOCK + CREATE ORDER ITEMS
            for item in cart_items:
                product = Product.objects.select_for_update().get(id=item.product.id)

                # Reserve Stock
                #in normal value comes first then update db its may conflict when 2 user can request at same time
                #and in F we direct target db and update data
                product.reserved_stock = F('reserved_stock') + item.quantity
                product.save()
                total += item.product.price * item.quantity

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item.quantity,
                    price=item.product.price
                )

            order.total_amount = total
            order.save()

            # Clear cart
            cart.items.all().delete()

        send_order_confirmation_email.delay(order.id)

        return Response(
            {
                "message": "Order created & stock reserved successfully",
                "order_id": order.id,
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message":"User registered successfully","user":UserSerializer(user).data},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    serializer = ForgotPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    username = serializer.validated_data['username']
    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response({'error': 'user not found'},status=status.HTTP_404_NOT_FOUND)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = password_reset_token.make_token(user)
    reset_link = f"{FRONTEND_URL.rstrip('/')}/reset/password/{uid}/{token}/"

    # send confirmation emails
    print("password reset link:", reset_link)
    subject = "Password Reset"
    messaage = f"Dear {user.username},\n\n This is Your Password Resetlink:\n{reset_link}\n\n If you did not request this, please ignore this email.\n\n Best regards,\n Your KRN ZONE Team"
    send_mail(subject, messaage, settings.EMAIL_HOST_USER, [user.email], fail_silently=True)

    return Response(
        {"message": "Password reset link sent"},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request,uidb64,token):
    serilizer = ResetPasswordSerializer(data=request.data)
    serilizer.is_valid(raise_exception=True)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid User'},status=status.HTTP_400_BAD_REQUEST)

    #token verification
    if not password_reset_token.check_token(user, token):
        return Response({'error': 'Invalid or expired token'},status=status.HTTP_400_BAD_REQUEST)
    #validated data that comes form the serializers
    user.set_password(serilizer.validated_data['new_password'])
    user.save()
    return Response({'message': 'Password reset successfully'},status=status.HTTP_200_OK)



@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def address_list_create(request):

    if request.method == "GET":
        addresses = Address.objects.filter(user=request.user)
        serializer = AdressSerializer(addresses, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = AdressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def address_delete(request, pk):
    try:
        address = Address.objects.get(id=pk, user=request.user)
        address.delete()
        return Response({"message": "Deleted"}, status=204)
    except Address.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
