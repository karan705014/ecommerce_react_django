from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Order

@shared_task
def send_order_confirmation_email(order_id):
    try:
        order = Order.objects.get(id=order_id)

        if not order.user.email:
            return "No email found"

        subject = "Order Confirmation"
        message = (
            f"Dear {order.name},\n\n"
            f"Your order has been confirmed.\n"
            f"Order ID: {order.id}\n\n"
            f"KRN ZONE Team"
        )

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [order.user.email],
            fail_silently=False
        )

        return "Email sent"

    except Exception as e:
        return str(e)
