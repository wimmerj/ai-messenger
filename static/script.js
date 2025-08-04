// Hlavní JavaScript pro AI Messenger
class AIMessenger {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.charCount = document.getElementById('charCount');
        
        this.initializeEventListeners();
        this.loadMessagesHistory();
        this.autoResizeTextarea();
    }

    initializeEventListeners() {
        // Odeslání zprávy tlačítkem
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Odeslání zprávy Enterem (Shift+Enter pro nový řádek)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Počítadlo znaků
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResizeTextarea();
        });

        // Vymazání historie
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = count;
        
        const counter = this.charCount.parentElement;
        if (count > 1800) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) {
            this.showError('Zpráva nesmí být prázdná!');
            return;
        }

        if (message.length > 2000) {
            this.showError('Zpráva je příliš dlouhá! Maximálně 2000 znaků.');
            return;
        }

        // Deaktivace inputu během odesílání
        this.setInputState(false);
        this.showLoading(true);

        // Zobrazení uživatelské zprávy
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();

        try {
            const response = await fetch('/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Zobrazení AI odpovědi
                this.addMessage(data.ai_response, 'ai', data.timestamp);
            } else {
                this.showError(data.error || 'Nastala chyba při komunikaci s AI');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Chyba sítě. Zkontrolujte připojení k internetu.');
        } finally {
            this.setInputState(true);
            this.showLoading(false);
            this.messageInput.focus();
        }
    }

    addMessage(content, role, timestamp = null) {
        // Odebrání uvítací zprávy při první zprávě
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const now = timestamp || new Date().toLocaleTimeString('cs-CZ', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(content)}</div>
            <div class="message-time">${now}</div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendBtn.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.focus();
        }
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Vložení za header
        const header = document.querySelector('.header');
        header.insertAdjacentElement('afterend', errorDiv);
        
        // Automatické odebrání po 5 sekundách
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const header = document.querySelector('.header');
        header.insertAdjacentElement('afterend', successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, "<br>");
    }

    async loadMessagesHistory() {
        try {
            const response = await fetch('/get_messages');
            const data = await response.json();
            
            if (response.ok && data.messages) {
                // Vymazání uvítací zprávy pokud existují zprávy
                if (data.messages.length > 0) {
                    const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
                    if (welcomeMessage) {
                        welcomeMessage.remove();
                    }
                }
                
                // Zobrazení historických zpráv
                data.messages.forEach(msg => {
                    this.addMessage(msg.content, msg.role, msg.timestamp);
                });
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    async clearHistory() {
        if (!confirm('Opravdu chcete vymazat celou historii konverzace?')) {
            return;
        }

        try {
            const response = await fetch('/clear_history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Vymazání zpráv z UI
                this.messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        <p>👋 Vítejte! Napište zprávu a začněte konverzaci s AI.</p>
                    </div>
                `;
                this.showSuccess('Historie byla úspěšně vymazána');
            } else {
                this.showError('Chyba při mazání historie');
            }
        } catch (error) {
            console.error('Error clearing history:', error);
            this.showError('Chyba sítě při mazání historie');
        }
    }
}

// Inicializace aplikace po načtení DOM
document.addEventListener('DOMContentLoaded', () => {
    new AIMessenger();
});

// Kontrola připojení k internetu
window.addEventListener('online', () => {
    console.log('Připojení k internetu obnoveno');
});

window.addEventListener('offline', () => {
    console.log('Ztraceno připojení k internetu');
});
