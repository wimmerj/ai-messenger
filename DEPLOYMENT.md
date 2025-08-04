# Render.com Deployment Guide

## Nasazení AI Messenger na Render.com

### Krok za krokem:

#### 1. Vytvoření GitHub repository
1. Jděte na GitHub.com a přihlaste se
2. Klikněte na "New repository" (zelené tlačítko)
3. Pojmenujte repo např: "ai-messenger"
4. Nastavte jako Public
5. Klikněte "Create repository"

#### 2. Nahrání kódu na GitHub

**Možnost A - Přes Git (pokud máte Git nainstalovaný):**
```bash
# V terminálu ve složce projektu
git init
git add .
git commit -m "Initial commit - AI Messenger"
git branch -M main
git remote add origin https://github.com/VAS_USERNAME/ai-messenger.git
git push -u origin main
```

**Možnost B - Přes GitHub web rozhraní:**
1. Otevřete vaše nové repo na GitHubu
2. Klikněte "uploading an existing file"
3. Přetáhněte všechny soubory projektu
4. Napište commit message: "Initial commit - AI Messenger"
5. Klikněte "Commit changes"

#### 3. Nasazení na Render.com

1. **Registrace/Přihlášení:**
   - Jděte na https://render.com
   - Klikněte "Get Started" 
   - Přihlaste se přes GitHub účet

2. **Vytvoření nové služby:**
   - Na dashboard klikněte "New +"
   - Vyberte "Web Service"
   - Připojte váš GitHub účet (pokud ještě není)
   - Vyberte repository "ai-messenger"
   - Klikněte "Connect"

3. **Konfigurace služby:**
   ```
   Name: ai-messenger (nebo jakékoli jméno)
   Region: Frankfurt (nejbližší k ČR)
   Branch: main
   Root Directory: (nechte prázdné)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python app.py
   Instance Type: Free
   ```

4. **Nastavení Environment Variables:**
   - Klikněte "Advanced"
   - Přidejte environment variable:
     ```
     Key: MONICA_API_KEY
     Value: sk-049nXVgkhXvC1mJIMdyuvOFPlc-GEGtec2OhmpnkeQ6Ksrz47edYR8bQRZmtYkLlQT0AIJpN-Hgc3l0a5wfjubpu4Z2O
     ```

5. **Nasazení:**
   - Klikněte "Create Web Service"
   - Render začne automaticky buildovat aplikaci
   - Počkejte 3-5 minut na dokončení

#### 4. Testování

Po úspěšném nasazení:
- Render vám poskytne URL typu: `https://ai-messenger-xyz.onrender.com`
- Otevřete URL v prohlížeči
- Otestujte odesílání zpráv

### Výhody Render.com Free Tier:

✅ 750 hodin měsíčně zdarma
✅ Automatické HTTPS/SSL
✅ Automatické redeployment při push na GitHub
✅ Předdefinované prostředí pro Python
✅ Snadné škálování

### Omezení Free Tier:

⚠️ Služba "usne" po 15 minutách nečinnosti
⚠️ První požadavek po probuzení trvá ~30 sekund
⚠️ Limitovaný výkon (512 MB RAM)

### Následující kroky po nasazení:

1. **Custom doména** (volitelné):
   - V nastavení služby můžete přidat vlastní doménu

2. **Monitorování**:
   - Render poskytuje logy a metriky v dashboardu

3. **Aktualizace**:
   - Každý push na GitHub automaticky redeploy

### Troubleshooting:

**Časté problémy:**
1. **Build selhává** - zkontrolujte requirements.txt
2. **App se nespustí** - zkontrolujte logy v Render dashboardu  
3. **API nefunguje** - ověřte environment variables

**Užitečné příkazy pro debugging:**
- Logy najdete v Render dashboard → Services → Vaše služba → Logs
