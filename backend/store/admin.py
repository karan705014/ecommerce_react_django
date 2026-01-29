from django.contrib import admin
from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    UserProfile,
    Order,
    OrderItem
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "price", "created_at")
    list_filter = ("category", "created_at")
    search_fields = ("name",)
    ordering = ("-created_at",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    search_fields = ("user__username",)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart", "product", "quantity")
    list_filter = ("product",)
    search_fields = ("product__name", "cart__user__username")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "phone")
    search_fields = ("user__username", "phone")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_amount", "payment_method", "created_at")
    list_filter = ("payment_method", "created_at")
    search_fields = ("user__username", "phone", "name")
    ordering = ("-created_at",)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "quantity", "price")
    search_fields = ("product__name", "order__user__username")
