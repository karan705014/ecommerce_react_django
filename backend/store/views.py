from rest_framework.response import Response
from rest_framework import status
from .models import Product,Category
from rest_framework.decorators import api_view
from . serializers import CategorySerializer,ProductSerializer

@api_view(['GET'])
def get_products(request):
    products= Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    products= Category.objects.all()
    serializer = CategorySerializer(products,many=True)
    return Response(serializer.data)