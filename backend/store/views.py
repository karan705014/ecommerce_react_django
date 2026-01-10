from rest_framework.response import Response
from rest_framework import status
from .models import Product,Category
from rest_framework.decorators import api_view
from . serializers import CategorySerializer,ProductSerializer

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
  