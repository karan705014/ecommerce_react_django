from django.urls import path
from .views import recommend_products

urlpatterns = [
    path('<int:product_id>/', recommend_products),
]
