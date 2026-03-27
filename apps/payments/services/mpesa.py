import requests
import base64
import os
from datetime import datetime

def get_access_token():
    consumer_key = os.getenv('MPESA_CONSUMER_KEY')
    consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
    credentials = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()
    response = requests.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        headers={'Authorization': f'Basic {credentials}'}
    )
    return response.json()['access_token']

def stk_push(phone, amount, order_id):
    token = get_access_token()
    shortcode = os.getenv('MPESA_SHORTCODE')
    passkey = os.getenv('MPESA_PASSKEY')
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": f"{os.getenv('BASE_URL')}/api/payments/mpesa/callback/",
        "AccountReference": f"Order-{order_id}",
        "TransactionDesc": "Electronics Purchase"
    }
    response = requests.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        json=payload,
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()