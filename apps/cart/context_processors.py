
def cart(request):
    """Add cart data to all templates."""
    cart = request.session.get('cart', {})
    return {'cart': cart}