from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
        name = models.CharField(max_length=100,unique=True)
        slug = models.SlugField(unique=True)

        def __str__(self):
            return self.name

class Product(models.Model):
        category = models.ForeignKey(Category,related_name="products",on_delete=models.CASCADE)
        name = models.CharField(max_length=200)
        description=models.TextField(blank=True)
        price = models.DecimalField( max_digits=10, decimal_places=2)
        image=models.ImageField( upload_to='products/',blank=True,null=True)
        created_at =models.DateTimeField( auto_now_add=True)
        #stock field
        stock = models.PositiveIntegerField(default=0)
        reserved_stock = models.PositiveIntegerField(default=0)
        low_stock_threshold = models.PositiveIntegerField(default=5)

        def available_stock(self):
            return self.stock - self.reserved_stock

        def __str__(self):
            return self.name


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)

    address_line = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)

    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.city}"



class Cart(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE)
        created_at =models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"Cart {self.id} for {self.user}"

        @property
        def total(self):
            return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
        cart = models.ForeignKey(Cart,related_name='items', on_delete=models.CASCADE)
        product = models.ForeignKey(Product, on_delete=models.CASCADE)
        quantity = models.PositiveIntegerField(default=1)

        def __str__(self):
            return f"{self.quantity} * {self.product.name}"

        @property
        def subtotal(self):
            return self.quantity * self.product.price



class UserProfile(models.Model):
        user = models.OneToOneField(User,on_delete=models.CASCADE)
        phone = models.CharField(blank=True, max_length=15)
        address = models.TextField(blank=True)


        def __str__(self):
            return self.user.username

        

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    payment_method = models.CharField(max_length=30, default="COD")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user}"




class OrderItem(models.Model):
        order = models.ForeignKey(Order,related_name='items', on_delete=models.CASCADE)
        product = models.ForeignKey(Product, on_delete=models.CASCADE)
        quantity = models.PositiveIntegerField(default=1)
        price = models.DecimalField(max_digits=10, decimal_places=2)

        def __str__(self):
            return f"{self.quantity} * {self.product.name}"
