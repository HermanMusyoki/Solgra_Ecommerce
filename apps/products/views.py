from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductListSerializer, ProductDetailSerializer, CategorySerializer
from .filters import ProductFilter

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(parent=None)
    serializer_class = CategorySerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category', 'brand').prefetch_related('images')
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'brand__name']
    ordering_fields = ['price', 'created_at', 'name']

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

class FeaturedProductsView(generics.ListAPIView):
    queryset = Product.objects.filter(is_featured=True, is_active=True)[:8]
    serializer_class = ProductListSerializer