from rest_framework.decorators import api_view
from rest_framework.response import Response
from store.models import Product
from .scoring import calculate_score


@api_view(['GET'])
def recommend_products(request, product_id):
    try:
        product = Product.objects.get(id=product_id)

        # Step 1: same category products (excluding current)
        recommended = Product.objects.filter(
            category=product.category
        ).exclude(id=product.id)

        data = []

        # Step 2: calculate score for each product
        for item in recommended:
            score = calculate_score(int(item.price), item.id)
            data.append({
                "id": item.id,
                "name": item.name,
                "price": item.price,
                "image": request.build_absolute_uri(item.image.url)
                if item.image else None,
                "score": score
            })

        # Step 3: score-based sorting and top 5 selection
        data = sorted(data, key=lambda x: x["score"], reverse=True)[:5]

        return Response(data)

    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=404
        )
