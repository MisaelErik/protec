export class PrivacyService {
  static init() {
    this.updatePrivacyMeter();
    this.calculatePrivacyScore();
    this.generateRiskAlerts();
  }
  
  static updatePrivacyMeter() {
    // In a real implementation, this would calculate based on collected data
    // For demonstration, we'll set it to high risk
    const riskLevelElement = document.getElementById('privacy-risk-level');
    const meterFillElement = document.getElementById('privacy-meter-fill');
    
    if (riskLevelElement) riskLevelElement.textContent = 'ALTO';
    if (meterFillElement) meterFillElement.className = 'privacy-meter-fill privacy-level-high';
  }
  
  static calculatePrivacyScore() {
    // Puntuación de privacidad basada en varios factores
    // Cuanto más bajo el número, mejor para la privacidad
    
    // Factores que aumentan la puntuación (mala privacidad):
    let score = 0;
    
    // Detectar características de identificación única
    const userAgent = navigator.userAgent;
    
    // Navegador específico (0-2 puntos)
    if (userAgent.includes('Chrome')) score += 1;
    if (userAgent.includes('Firefox')) score += 1;
    if (userAgent.includes('Safari')) score += 1;
    if (userAgent.includes('Edge')) score += 1;
    
    // Sistema operativo (0-1 punto)
    if (navigator.platform) score += 1;
    
    // Recursos de hardware (0-3 puntos)
    if (navigator.hardwareConcurrency) score += 1;
    if (navigator.deviceMemory) score += 1;
    if (screen.width && screen.height) score += 1;
    
    // Otros identificadores (0-2 puntos)
    if (navigator.languages && navigator.languages.length > 1) score += 1;
    if (navigator.plugins && navigator.plugins.length > 0) score += 1;
    
    // Ajustar la puntuación a una escala de 0-10
    const finalScore = Math.min(10, Math.max(0, score * 0.8));
    
    // Actualizar la puntuación visual
    const scoreElement = document.getElementById('privacy-score-value');
    if (scoreElement) {
      scoreElement.textContent = finalScore.toFixed(1) + '/10';
    }
    
    // Actualizar la barra de puntuación
    const scoreBar = document.getElementById('privacy-score-fill');
    if (scoreBar) {
      // Cuanto más alto el score, más roja la barra (menos privacidad)
      const percentage = (finalScore / 10) * 100;
      scoreBar.style.width = percentage + '%';
      
      // Actualizar la clase para cambiar el color
      scoreBar.className = 'privacy-meter-fill';
      if (percentage < 30) {
        scoreBar.classList.add('privacy-level-low');
      } else if (percentage < 70) {
        scoreBar.classList.add('privacy-level-medium');
      } else {
        scoreBar.classList.add('privacy-level-high');
      }
    }
    
    // Actualizar comparación de riesgo (simulada)
    const riskComparison = document.getElementById('risk-comparison');
    if (riskComparison) {
      const uniqueness = 80 + Math.floor(Math.random() * 15); // Valor entre 80-95%
      riskComparison.textContent = `Tu huella digital es más única que el ${uniqueness}% de los usuarios`;
    }
  }
  
  static generateRiskAlerts() {
    try {
      const alertsElement = document.getElementById('risk-alerts');
      if (alertsElement) {
        const alerts = [];
        
        // Detectar posibles riesgos basados en la configuración actual
        const ua = navigator.userAgent.toLowerCase();
        
        // Alerta: Navegador común (fácil de identificar)
        alerts.push('Tu navegador es comúnmente utilizado, lo que facilita el rastreo');
        
        // Alerta: Plugins detectados
        if (navigator.plugins.length > 3) {
          alerts.push(`Tu navegador tiene ${navigator.plugins.length} plugins instalados, lo que incrementa tu huella digital`);
        }
        
        // Alerta: Idiomas múltiples
        if (navigator.languages && navigator.languages.length > 2) {
          alerts.push(`Tienes ${navigator.languages.length} idiomas configurados, lo que te hace más identificable`);
        }
        
        // Alerta: Canvas fingerprint detectado
        alerts.push('Tu huella digital basada en canvas es única y puede ser usada para rastrearte');
        
        // Alerta: WebRTC puede estar revelando IP local
        if ('RTCPeerConnection' in window || 'mozRTCPeerConnection' in window || 'webkitRTCPeerConnection' in window) {
          alerts.push('WebRTC está disponible y puede revelar tu IP local');
        }
        
        // Mostrar alertas
        alertsElement.innerHTML = alerts.map(alert => `<li>${alert}</li>`).join('');
      }
    } catch (e) {
      console.log('Error al generar alertas de riesgo:', e);
      const alertsElement = document.getElementById('risk-alerts');
      if (alertsElement) {
        alertsElement.innerHTML = '<li>Error al cargar alertas</li>';
      }
    }
  }
  
  static updatePrivacyInfo() {
    // Actualizar información de privacidad
    this.calculatePrivacyScore();
    this.generateRiskAlerts();
  }
}