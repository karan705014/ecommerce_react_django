from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Order

@shared_task
def send_order_confirmation_email(order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return "Order not found"

    items = order.items.all()

    item_list = ""
    for item in items:
        item_list += f"- {item.product.name} (x{item.quantity})\n"

    subject = "Order Confirmation"

    message = f"""
Hi {order.user.username},

Your order #{order.id} has been confirmed!

Items:
{item_list}

Total Amount: ₹{order.total_amount}

Thank you for shopping with us!
"""

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [order.user.email],
        fail_silently=False
    )

    return "Email sent successfully"
