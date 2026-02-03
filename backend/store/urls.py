from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/',views.register),
    path("token/",TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path("token/refresh/",TokenRefreshView.as_view(),name="token_refresh"),
    path('products/',views.get_products),
    path('categories/',views.get_categories),
    path('products/<int:pk>/',views.get_product_details), # when click on card this will be called
    path('cart/',views.get_cart),
    path('cart/add/',views.add_to_cart),
    path('cart/remove/',views.remove_from_cart),
    path('cart/update/', views.update_cart_quantity),
    path ('orders/create/', views.create_order),
    path('reset/password/', views.forgot_password),
    path('reset/password/<uidb64>/<token>/', views.reset_password),
]
