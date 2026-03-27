from django.db.models import Sum, Count
from django.db.models.functions import TruncDay, TruncMonth
from apps.orders.models import Order, OrderItem
from apps.products.models import Product

def get_dashboard_metrics():
    orders = Order.objects.filter(status__in=['paid', 'shipped', 'delivered'])
    return {
        'total_revenue': orders.aggregate(total=Sum('total_amount'))['total'] or 0,
        'total_orders': orders.count(),
        'pending_orders': Order.objects.filter(status='pending').count(),
        'low_stock_products': Product.objects.filter(stock__lte=5, is_active=True).count(),
    }

def get_sales_over_time(period='daily'):
    trunc = TruncDay if period == 'daily' else TruncMonth
    return (
        Order.objects
        .filter(status__in=['paid', 'shipped', 'delivered'])
        .annotate(period=trunc('created_at'))
        .values('period')
        .annotate(revenue=Sum('total_amount'), orders=Count('id'))
        .order_by('period')
    )

def get_top_products(limit=10):
    return (
        OrderItem.objects
        .values('product__name', 'product__id')
        .annotate(total_sold=Sum('quantity'), revenue=Sum('price'))
        .order_by('-total_sold')[:limit]
    )