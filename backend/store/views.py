from rest_framework.response import Response
from rest_framework import status
from .models import Product,Category,Cart,CartItem
from rest_framework.decorators import api_view
from . serializers import CategorySerializer,ProductSerializer,CartItemSerializer,CartSerializer

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
def get_cart(request):
    cart,created = Cart.objects.get_or_create(user=None)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart,created = Cart.objects.get_or_create(user=None)
    item,created = CartItem.objects.get_or_create(cart=cart , product=product)
    if not created:
        item.quantity+=1
        item.save()
    return Response({"message":"product was added to cart","cart":CartItemSerializer(cart).data})

@api_view(['POST'])
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
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({"message":"product was removed from cart"})