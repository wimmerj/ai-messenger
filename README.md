# AI Messenger - Monica.im

Jednoduchá webová aplikace pro chatování s umělou inteligencí Monica.im.

## Funkce

- 💬 Chatování s AI v reálném čase
- 🗂️ Historie konverzace
- 🎨 Moderní responzivní design
- 🚀 Jednoduché nasazení

## Požadavky

- Python 3.7+
- Flask
- Requests
- Internetové připojení

## Instalace

1. **Klonování/stažení projektu**
   ```bash
   # Nebo jednoduše stáhněte soubory do složky
   ```

2. **Instalace závislostí**
   ```bash
   pip install -r requirements.txt
   ```

3. **Nastavení API klíče**
   - Otevřete soubor `app.py`
   - Najděte řádek s `MONICA_API_KEY`
   - Vložte váš API klíč (již je nastaven)

## Spuštění

```bash
python app.py
```

Aplikace bude dostupná na: `http://localhost:5000`

## Struktura projektu

```
├── app.py              # Hlavní Flask aplikace
├── requirements.txt    # Python závislosti
├── static/
│   ├── style.css      # CSS styly
│   └── script.js      # JavaScript funkcionalita
└── templates/
    └── index.html     # HTML template
```

## API Endpoints

- `GET /` - Hlavní stránka
- `POST /send_message` - Odesílání zpráv do AI
- `GET /get_messages` - Získání historie zpráv
- `POST /clear_history` - Vymazání historie

## Nasazení na server

### Lokální testování
```bash
python app.py
```

### Produkční nasazení

1. **Heroku**
   - Vytvořte `Procfile`: `web: python app.py`
   - Nastavte environment variables
   - Deploy přes Git

2. **Railway/Render**
   - Propojte GitHub repository
   - Nastavte environment variables
   - Automatické nasazení

3. **VPS Server**
   - Nainstalujte nginx, gunicorn
   - Nastavte systemd service
   - Konfigurujte SSL

## Bezpečnostní poznámky

⚠️ **DŮLEŽITÉ**: 
- API klíč je momentálně přímo v kódu
- Pro produkci použijte environment variables
- Přidejte rate limiting
- Implementujte autentifikaci

## Rozšíření

Aplikaci můžete rozšířit o:
- 🔐 Uživatelské účty
- 💾 Databázi (SQLite, PostgreSQL)
- 📝 Export konverzací
- 🎨 Témata a přizpůsobení
- 📱 Mobile aplikaci
- 🔊 Text-to-speech
- 📁 Nahrávání souborů

## Troubleshooting

### Časté problémy:

1. **ModuleNotFoundError**
   ```bash
   pip install -r requirements.txt
   ```

2. **API chyby**
   - Zkontrolujte API klíč
   - Ověřte internetové připojení
   - Zkontrolujte kvóty Monica.im

3. **Port už je používán**
   ```bash
   # Změňte port v app.py na jiný (např. 5001)
   app.run(debug=True, host='0.0.0.0', port=5001)
   ```

## Licence

Tento projekt je vytvořen pro vzdělávací účely.
