from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime

app = Flask(__name__)

# Monica.im API konfigurace
MONICA_API_KEY = os.environ.get('MONICA_API_KEY', 'sk-049nXVgkhXvC1mJIMdyuvOFPlc-GEGtec2OhmpnkeQ6Ksrz47edYR8bQRZmtYkLlQT0AIJpN-Hgc3l0a5wfjubpu4Z2O')
MONICA_API_URL = "https://openapi.monica.im/v1/chat/completions"

# Simulované úložiště zpráv (v produkci by měla být databáze)
messages_history = []

@app.route('/')
def index():
    """Hlavní stránka s messenger rozhraním"""
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    """Endpoint pro odesílání zpráv do Monica AI"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Zpráva nesmí být prázdná'}), 400
        
        # Uložení uživatelské zprávy
        user_msg = {
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.now().strftime('%H:%M:%S')
        }
        messages_history.append(user_msg)
        
        # Příprava dat pro Monica API
        api_data = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "Jsi pomocný AI asistent. Odpovídej v češtině."},
                {"role": "user", "content": user_message}
            ],
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        # Volání Monica API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {MONICA_API_KEY}"
        }
        
        response = requests.post(MONICA_API_URL, json=api_data, headers=headers)
        
        if response.status_code == 200:
            ai_response = response.json()
            ai_message = ai_response['choices'][0]['message']['content']
            
            # Uložení AI odpovědi
            ai_msg = {
                'role': 'assistant',
                'content': ai_message,
                'timestamp': datetime.now().strftime('%H:%M:%S')
            }
            messages_history.append(ai_msg)
            
            return jsonify({
                'success': True,
                'user_message': user_message,
                'ai_response': ai_message,
                'timestamp': ai_msg['timestamp']
            })
        else:
            return jsonify({
                'error': f'Chyba API: {response.status_code} - {response.text}'
            }), 500
            
    except Exception as e:
        return jsonify({'error': f'Neočekávaná chyba: {str(e)}'}), 500

@app.route('/get_messages')
def get_messages():
    """Endpoint pro získání historie zpráv"""
    return jsonify({'messages': messages_history})

@app.route('/clear_history', methods=['POST'])
def clear_history():
    """Endpoint pro vymazání historie zpráv"""
    global messages_history
    messages_history = []
    return jsonify({'success': True, 'message': 'Historie byla vymazána'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
