from rest_framework import serializers
from .models import Address, Product,Category,CartItem,Cart,Order
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model= Category
        fields ='__all__'

class AdressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    class Meta:
         model= Product
         fields ='__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name',read_only=True)
    product_price = serializers.DecimalField(source='product.price',max_digits=10,decimal_places=2,read_only=True)
    product_image = serializers.ImageField(source='product.image',read_only=True)

    class Meta:
        model =CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    #HERE CART ITEM SERIALIZEER  INCLUDE ALL THINS IN THE CARTITEM MODEL
    #items mean cart.items.all()  related_name='items' in CartItem model
    #its insclude all cartitems that belong to cart comes from view
    items = CartItemSerializer(many=True,read_only=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']


class RegisterSerializer(serializers.ModelSerializer):
    password =serializers.CharField(write_only=True)
    password2 =serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','username','email','password','password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        user = User.objects.create_user(username=username,email=email,password=password)
        return user

class ForgotPasswordSerializer(serializers.Serializer):
    username =serializers.CharField()


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs


