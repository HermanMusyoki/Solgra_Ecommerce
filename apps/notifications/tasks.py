from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

@shared_task
def send_order_confirmation_email(order_id):
    from apps.orders.models import Order
    order = Order.objects.select_related('user').prefetch_related('items__product').get(id=order_id)

    html_message = render_to_string('emails/order_confirmation.html', {'order': order})
    send_mail(
        subject=f'Order Confirmation - #{order.order_number}',
        message='',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[order.user.email],
        html_message=html_message,
    )

@shared_task
def send_order_status_update_email(order_id):
    from apps.orders.models import Order
    order = Order.objects.select_related('user').get(id=order_id)

    html_message = render_to_string('emails/order_update.html', {'order': order})
    send_mail(
        subject=f'Order Update - #{order.order_number} is now {order.get_status_display()}',
        message='',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[order.user.email],
        html_message=html_message,
    )