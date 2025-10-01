export class NetworkService {
  static networkData = {};
  
  static async init() {
    await this.fetchIPAndLocation();
    this.measureSpeed();
    this.measureLatency();
  }
  
  static async fetchIPAndLocation() {
    const ipElement = document.getElementById('ip-address');
    const locationElement = document.getElementById('location');
    const ispElement = document.getElementById('isp-info');
    const asnElement = document.getElementById('asn-info');
    const postalElement = document.getElementById('postal-code');
    
    // Mostrar un spinner mientras se carga
    if (ipElement) ipElement.innerHTML = '<span class="loading-spinner"></span>';
    if (locationElement) locationElement.innerHTML = '<span class="loading-spinner"></span>';
    if (ispElement) ispElement.textContent = 'Detectando...';
    if (asnElement) asnElement.textContent = 'Detectando...';
    if (postalElement) postalElement.textContent = 'Detectando...';
    
    try {
      // Intentamos primero con un servicio que devuelve información detallada
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Error en la respuesta del servicio');
      }
      const data = await response.json();
      
      if (ipElement) ipElement.textContent = data.ip || 'No disponible';
      if (locationElement) locationElement.textContent = `${data.city || ''}, ${data.region || ''}, ${data.country_name || 'No disponible'}`;
      if (ispElement) ispElement.textContent = data.org || 'No disponible';
      if (asnElement) asnElement.textContent = data.asn || 'No disponible';
      if (postalElement) postalElement.textContent = data.postal || 'No disponible';
      
      // Guardar datos para otros servicios
      this.networkData = data;
      
      // Llamar a la función para obtener información adicional
      setTimeout(() => this.getAdditionalLocationInfo(), 500);
    } catch (error) {
      console.log('Error con ipapi.co, intentando con otro servicio:', error);
      try {
        // Intentar con otro servicio como ipinfo.io
        const response2 = await fetch('https://ipinfo.io/json');
        const data2 = await response2.json();
        
        if (ipElement) ipElement.textContent = data2.ip || 'No disponible';
        if (locationElement) locationElement.textContent = data2.city ? `${data2.city}, ${data2.region}, ${data2.country}` : 'No disponible';
        if (ispElement) ispElement.textContent = data2.org || 'No disponible';
        if (asnElement) asnElement.textContent = data2.org ? data2.org.split(' ')[0] : 'No disponible';
        if (postalElement) postalElement.textContent = data2.postal || 'No disponible';
      } catch (error2) {
        console.log('Error con ipinfo.io también:', error2);
        try {
          // Último intento con un servicio básico para IP
          const response3 = await fetch('https://api.ipify.org?format=json');
          const data3 = await response3.json();
          
          if (ipElement) ipElement.textContent = data3.ip || 'No disponible';
          if (locationElement) locationElement.textContent = 'Ubicación no disponible (permiso necesario)';
          if (ispElement) ispElement.textContent = 'ISP no disponible';
          if (asnElement) asnElement.textContent = 'ASN no disponible';
          if (postalElement) postalElement.textContent = 'No disponible';
        } catch (error3) {
          console.log('Todos los servicios fallaron:', error3);
          if (ipElement) ipElement.textContent = 'Error al obtener IP';
          if (locationElement) locationElement.textContent = 'Error al obtener ubicación';
          if (ispElement) ispElement.textContent = 'Error al obtener ISP';
          if (asnElement) asnElement.textContent = 'Error al obtener ASN';
          if (postalElement) postalElement.textContent = 'Error';
        }
      }
    }
  }
  
  static async getAdditionalLocationInfo() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Error en la respuesta del servicio');
      }
      const data = await response.json();
      
      // Elemento de clima
      const weatherElement = document.getElementById('local-weather');
      if (weatherElement) {
        // Simularemos información de clima basada en región
        const climateMap = {
          'US': ['Soleado', 'Nublado', 'Lluvioso'],
          'CA': ['Frío', 'Nevado', 'Parcialmente nublado'],
          'MX': ['Caluroso', 'Soleado', 'Parcialmente nublado'],
          'AR': ['Cálido', 'Soleado', 'Ventoso'],
          'BR': ['Caluroso', 'Húmedo', 'Parcialmente nublado'],
          'ES': ['Soleado', 'Parcialmente nublado', 'Lluvioso'],
          'FR': ['Nublado', 'Soleado', 'Lluvioso'],
          'DE': ['Nublado', 'Parcialmente nublado', 'Lluvioso'],
          'GB': ['Nublado', 'Lluvioso', 'Ventoso'],
          'IT': ['Soleado', 'Parcialmente nublado', 'Lluvioso'],
          'JP': ['Húmedo', 'Soleado', 'Lluvioso'],
          'CN': ['Nublado', 'Húmedo', 'Parcialmente nublado'],
          'IN': ['Caluroso', 'Húmedo', 'Monzónico'],
          'AU': ['Soleado', 'Caluroso', 'Parcialmente nublado'],
          'ZA': ['Soleado', 'Cálido', 'Parcialmente nublado'],
          'RU': ['Frío', 'Nevado', 'Claro y frío']
        };
        
        const countryWeathers = climateMap[data.country] || ['Clima variable', 'Parcialmente nublado', 'Soleado'];
        const randomWeather = countryWeathers[Math.floor(Math.random() * countryWeathers.length)];
        weatherElement.textContent = randomWeather;
      }
      
      // Elemento de moneda
      const currencyElement = document.getElementById('local-currency');
      if (currencyElement) {
        // Mapa de monedas por país
        const currencyMap = {
          'US': 'USD (Dólar Estadounidense)',
          'GB': 'GBP (Libra Esterlina)',
          'EU': 'EUR (Euro)',
          'JP': 'JPY (Yen Japonés)',
          'CA': 'CAD (Dólar Canadiense)',
          'AU': 'AUD (Dólar Australiano)',
          'CN': 'CNY (Yuan Chino)',
          'MX': 'MXN (Peso Mexicano)',
          'AR': 'ARS (Peso Argentino)',
          'BR': 'BRL (Real Brasileño)',
          'CL': 'CLP (Peso Chileno)',
          'CO': 'COP (Peso Colombiano)',
          'PE': 'PEN (Sol Peruano)',
          'VE': 'VES (Bolívar Venezolano)',
          'ES': 'EUR (Euro)',
          'FR': 'EUR (Euro)',
          'DE': 'EUR (Euro)',
          'IT': 'EUR (Euro)',
          'BE': 'EUR (Euro)',
          'NL': 'EUR (Euro)',
          'PT': 'EUR (Euro)',
          'GR': 'EUR (Euro)',
          'IN': 'INR (Rupia India)',
          'KR': 'KRW (Won Surcoreano)',
          'SG': 'SGD (Dólar de Singapur)',
          'NZ': 'NZD (Dólar Neozelandés)',
          'CH': 'CHF (Franco Suizo)',
          'NO': 'NOK (Corona Noruega)',
          'SE': 'SEK (Corona Sueca)',
          'DK': 'DKK (Corona Danesa)',
          'ZA': 'ZAR (Rand Sudafricano)',
          'RU': 'RUB (Rublo Ruso)',
          'TR': 'TRY (Lira Turca)',
          'SA': 'SAR (Riyal Saudí)',
          'AE': 'AED (Dírham Emiratí)',
          'IL': 'ILS (Nuevo Shekel Israelí)'
        };
        
        const countryCurrency = currencyMap[data.country] || 'Moneda local desconocida';
        currencyElement.textContent = countryCurrency;
      }
    } catch (error) {
      console.log('Error obteniendo información adicional:', error);
      
      const weatherElement = document.getElementById('local-weather');
      const currencyElement = document.getElementById('local-currency');
      
      if (weatherElement) weatherElement.textContent = 'Error al obtener';
      if (currencyElement) currencyElement.textContent = 'Error al obtener';
    }
  }
  
  static async measureLatency() {
    const latencyElement = document.getElementById('latency-info');
    if (!latencyElement) return;
    
    const start = performance.now();
    try {
      const response = await fetch('https://httpbin.org/get', { method: 'HEAD' });
      const end = performance.now();
      const latency = Math.round(end - start);
      latencyElement.textContent = `${latency} ms`;
    } catch (e) {
      // Alternativa: medir el tiempo de respuesta de una imagen pequeña
      const imgStart = performance.now();
      const img = new Image();
      img.onload = () => {
        const imgEnd = performance.now();
        const latency = Math.round(imgEnd - imgStart);
        latencyElement.textContent = `${latency} ms (estimado)`;
      };
      img.onerror = () => {
        latencyElement.textContent = 'No disponible';
      };
      img.src = 'https://httpbin.org/image/png?_=' + Date.now();
    }
  }
  
  static async measureSpeed() {
    const speedElement = document.getElementById('speed-info');
    if (!speedElement) return;
    
    const startTime = new Date().getTime();
    try {
      const imageUrl = 'https://httpbin.org/image/png?_=' + Date.now();
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // en segundos
      const bitsLoaded = imageBlob.size * 8;
      const speedBps = (bitsLoaded / duration).toFixed(2);
      const speedMbps = (speedBps / 1000000).toFixed(2);
      speedElement.textContent = `${speedMbps} Mbps (estimado)`;
    } catch (e) {
      speedElement.textContent = 'No disponible';
    }
  }
  
  static updateNetworkInfo() {
    // Actualizar información de red
    try {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const networkInfoElement = document.getElementById('network-info');
      if (networkInfoElement) {
        networkInfoElement.textContent = conn ? `Tipo: ${conn.effectiveType || 'Desconocido'}, Velocidad: ${conn.downlink ? conn.downlink + ' Mbps' : 'Desconocido'}` : 'No disponible';
      }
      
      // Tipo de conexión
      const connectionTypeElement = document.getElementById('connection-type');
      if (conn && connectionTypeElement) {
        let connectionType = 'Desconocido';
        switch(conn.type || conn.connectionType) {
          case 'wifi':
            connectionType = 'Wi-Fi';
            break;
          case 'cellular':
            connectionType = 'Celular';
            if (conn.effectiveType) {
              if (conn.effectiveType.includes('4g')) connectionType += ' (4G)';
              else if (conn.effectiveType.includes('3g')) connectionType += ' (3G)';
              else if (conn.effectiveType.includes('2g')) connectionType += ' (2G)';
              else if (conn.effectiveType === '5g') connectionType += ' (5G)';
              else connectionType += ` (${conn.effectiveType})`;
            }
            break;
          case 'ethernet':
            connectionType = 'Cable (Ethernet)';
            break;
          case 'none':
            connectionType = 'Sin conexión';
            break;
          case 'bluetooth':
            connectionType = 'Bluetooth';
            break;
          case 'wimax':
            connectionType = 'WiMAX';
            break;
          case 'other':
            connectionType = 'Otro';
            break;
          default:
            connectionType = conn.type || conn.connectionType || 'Desconocido';
        }
        connectionTypeElement.textContent = connectionType;
      } else if (connectionTypeElement) {
        connectionTypeElement.textContent = 'No disponible';
      }
    } catch (e) {
      const networkInfoElement = document.getElementById('network-info');
      const connectionTypeElement = document.getElementById('connection-type');
      
      if (networkInfoElement) networkInfoElement.textContent = 'Error al obtener';
      if (connectionTypeElement) connectionTypeElement.textContent = 'Error al obtener';
    }
  }
}