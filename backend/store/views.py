from rest_framework.response import Response
from rest_framework import status
from .models import Product,Category,Cart,CartItem,Order,OrderItem
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from . serializers import CategorySerializer,ProductSerializer,CartItemSerializer,CartSerializer,RegisterSerializer,UserSerializer  


@api_view(['GET'])
def get_products(request):
    products= Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data ,status=status.HTTP_200_OK)


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
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method','COD')

        #validate phone number
        if not phone.isdigit() or len(phone) < 10:
            return Response({'error':'Invalid phone number'},status=status.HTTP_400_BAD_REQUEST)
        #get user cart 
        cart ,created = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error':'Cart is empty'},status=status.HTTP_400_BAD_REQUEST)   
        
        total = sum([item.product.price * item.quantity for item in cart.items.all()])
        order = Order.objects.create(
            user = request.user,
            name = name,
            address = address,
            phone = phone,
            payment_method = payment_method,
            total_amount = total
        )
        for item in cart.items.all():
            OrderItem.objects.create(
                order = order,
                product = item.product,
                quantity = item.quantity,
                price = item.product.price
            )

        #clear the cart
        cart.items.all().delete()
        return Response({'message':'Order created successfully','order_id': order.id},status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message":"User registered successfully","user":UserSerializer(user).data},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)