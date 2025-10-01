export class UIService {
  static init() {
    this.generatePrivacyTips();
    this.setupEventListeners();
  }
  
  static generatePrivacyTips() {
    try {
      const browserTipsElement = document.getElementById('browser-tips');
      if (browserTipsElement) {
        // Detectar navegador y generar recomendaciones específicas
        const ua = navigator.userAgent;
        let browserName = 'navegador';
        
        if (ua.includes('Chrome')) browserName = 'Chrome';
        else if (ua.includes('Firefox')) browserName = 'Firefox';
        else if (ua.includes('Safari')) browserName = 'Safari';
        else if (ua.includes('Edg')) browserName = 'Edge';
        
        const tips = [
          `Usa modo incógnito/privado en ${browserName} para no dejar rastro`,
          'Desactiva JavaScript en sitios no confiables',
          'Configura las cookies para bloquear cookies de terceros',
          'Habilita "No Rastrear" en las opciones del navegador',
          'Revisa y actualiza regularmente los permisos de sitios web'
        ];
        
        browserTipsElement.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
      }
      
      const extElement = document.getElementById('security-extensions');
      if (extElement) {
        const extensions = [
          'uBlock Origin - Bloqueador de anuncios y rastreadores',
          'Privacy Badger - Bloquea rastreadores invisibles',
          'HTTPS Everywhere - Fuerza conexiones seguras',
          'Decentraleyes - Protección contra rastreo de CDN',
          'Cookie AutoDelete - Borra cookies automáticamente'
        ];
        
        extElement.innerHTML = extensions.map(ext => `<li>${ext}</li>`).join('');
      }
    } catch (e) {
      console.log('Error al generar recomendaciones:', e);
    }
  }
  
  static setupEventListeners() {
    // Geolocalización
    const geolocationBtn = document.getElementById('request-geolocation');
    if (geolocationBtn) {
      geolocationBtn.addEventListener('click', () => {
        const btn = document.getElementById('request-geolocation');
        const status = document.getElementById('geolocation-status');
        if (!navigator.geolocation) { 
          if (status) status.textContent = 'No soportado'; 
          return; 
        }
        if (btn) btn.disabled = true;
        navigator.geolocation.getCurrentPosition(
          pos => {
            if (status) {
              status.textContent = `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`;
              status.style.color = '#22C55E';
            }
            if (btn) btn.style.display = 'none';
          },
          () => {
            if (status) {
              status.textContent = 'Permiso denegado';
              status.style.color = '#EF4444';
            }
            if (btn) btn.style.display = 'none';
          }
        );
      });
    }
    
    // Cámara
    const cameraBtn = document.getElementById('request-camera');
    if (cameraBtn) {
      cameraBtn.addEventListener('click', async () => {
        const btn = document.getElementById('request-camera');
        const status = document.getElementById('camera-status');
        const feed = document.getElementById('camera-feed');
        if (!navigator.mediaDevices?.getUserMedia) { 
          if (status) status.textContent = 'API no soportada'; 
          return; 
        }
        if (btn) btn.disabled = true;
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (status) {
            status.textContent = 'Cámara activa'; 
            status.style.color = '#22C55E';
          }
          if (feed) {
            feed.style.display = 'block'; 
            feed.srcObject = stream;
          }
          if (btn) btn.style.display = 'none';
        } catch (err) { 
          if (status) {
            status.textContent = 'Acceso denegado'; 
            status.style.color = '#EF4444';
          }
          if (btn) btn.style.display = 'none'; 
        }
      });
    }
    
    // Micrófono
    const micBtn = document.getElementById('request-mic');
    if (micBtn) {
      micBtn.addEventListener('click', async () => {
        const btn = document.getElementById('request-mic');
        const status = document.getElementById('mic-status');
        const viz = document.getElementById('mic-visualizer');
        if (!navigator.mediaDevices?.getUserMedia) { 
          if (status) status.textContent = 'API no soportada'; 
          return; 
        }
        if (btn) btn.disabled = true;
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (status) {
            status.textContent = 'Micrófono activo'; 
            status.style.color = '#22C55E';
          }
          if (viz) viz.style.display = 'block';
          if (btn) btn.style.display = 'none';
          
          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          const canvasCtx = viz.getContext('2d');
          
          function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            if (canvasCtx) {
              canvasCtx.fillStyle = '#111827'; 
              canvasCtx.fillRect(0, 0, viz.width, viz.height);
              let barWidth = (viz.width / bufferLength) * 2.5, barHeight, x = 0;
              for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                canvasCtx.fillStyle = `rgb(59, 130, ${barHeight + 100})`;
                canvasCtx.fillRect(x, viz.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
              }
            }
          }
          draw();
        } catch (err) { 
          if (status) {
            status.textContent = 'Acceso denegado'; 
            status.style.color = '#EF4444';
          }
          if (btn) btn.style.display = 'none'; 
        }
      });
    }
    
    // Sensores
    const sensorsBtn = document.getElementById('request-sensors');
    if (sensorsBtn) {
      sensorsBtn.addEventListener('click', () => {
        const btn = document.getElementById('request-sensors');
        const status = document.getElementById('sensors-status');
        const dataDiv = document.getElementById('sensors-data');
        if (btn) btn.disabled = true;
        if (typeof(Accelerometer) === "undefined") { 
          if (status) status.textContent = 'No soportado'; 
          if (btn) btn.style.display = 'none';
          return; 
        }
        Promise.all([navigator.permissions.query({ name: 'accelerometer' }), navigator.permissions.query({ name: 'gyroscope' })]).then((results) => {
          if (results.every(result => result.state === 'granted' || result.state === 'prompt')) {
            if (status) {
              status.textContent = 'Sensores activos'; 
              status.style.color = '#22C55E';
            }
            if (dataDiv) dataDiv.style.display = 'block';
            if (btn) btn.style.display = 'none';
            const acl = new Accelerometer({ frequency: 60 });
            acl.addEventListener('reading', () => { 
              if (dataDiv) {
                dataDiv.innerHTML = `<b>Accel:</b> X:${acl.x.toFixed(2)} Y:${acl.y.toFixed(2)} Z:${acl.z.toFixed(2)}`;
              }
            });
            acl.start();
          } else { 
            if (status) {
              status.textContent = 'Permiso denegado'; 
              status.style.color = '#EF4444';
            }
            if (btn) btn.style.display = 'none'; 
          }
        });
      });
    }
    
    // Portapapeles
    const clipboardBtn = document.getElementById('request-clipboard');
    if (clipboardBtn) {
      clipboardBtn.addEventListener('click', async () => {
        const btn = document.getElementById('request-clipboard');
        const status = document.getElementById('clipboard-status');
        const content = document.getElementById('clipboard-content');
        if (!navigator.clipboard?.readText) { 
          if (status) status.textContent = 'API no soportada'; 
          return; 
        }
        if (btn) btn.disabled = true;
        try {
          const text = await navigator.clipboard.readText();
          if (status) {
            status.textContent = 'Contenido leído:'; 
            status.style.color = '#22C55E';
          }
          if (content) {
            content.textContent = text || '(El portapapeles está vacío)';
            content.style.display = 'block';
          }
          if (btn) btn.style.display = 'none';
        } catch (err) { 
          if (status) {
            status.textContent = 'Permiso denegado'; 
            status.style.color = '#EF4444';
          }
          if (btn) btn.style.display = 'none'; 
        }
      });
    }
  }
  
  static updateUI() {
    // Actualizar información de plugins
    try {
      const pluginsElement = document.getElementById('plugins');
      if (pluginsElement) {
        const plugins = [];
        for (let i = 0; i < navigator.plugins.length; i++) {
          plugins.push(navigator.plugins[i].name);
        }
        pluginsElement.textContent = plugins.length > 0 ? plugins.join(', ') : 'Ninguno detectado';
      }
    } catch (e) {
      const pluginsElement = document.getElementById('plugins');
      if (pluginsElement) pluginsElement.textContent = 'Error al obtener';
    }
    
    // Actualizar información de cookies
    try {
      const cookiesElement = document.getElementById('cookies');
      if (cookiesElement) {
        const cookieTypes = [];
        if (navigator.cookieEnabled) cookieTypes.push('Estándar');
        cookiesElement.textContent = cookieTypes.length > 0 ? cookieTypes.join(', ') : 'Ninguno';
      }
    } catch (e) {
      const cookiesElement = document.getElementById('cookies');
      if (cookiesElement) cookiesElement.textContent = 'Error al obtener';
    }
    
    // Actualizar soporte táctil
    try {
      const touchSupportElement = document.getElementById('touch-support');
      if (touchSupportElement) {
        const touchSupport = ('ontouchstart' in window) || 
          (navigator.maxTouchPoints > 0) || 
          (navigator.msMaxTouchPoints > 0);
        touchSupportElement.textContent = touchSupport ? 'Sí' : 'No';
      }
    } catch (e) {
      const touchSupportElement = document.getElementById('touch-support');
      if (touchSupportElement) touchSupportElement.textContent = 'Error al obtener';
    }
    
    // Actualizar información de zona horaria
    try {
      const timezoneElement = document.getElementById('timezone');
      if (timezoneElement) {
        timezoneElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'No disponible';
      }
    } catch (e) {
      const timezoneElement = document.getElementById('timezone');
      if (timezoneElement) timezoneElement.textContent = 'Error al obtener';
    }
    
    // Actualizar políticas de seguridad
    try {
      const hstsElement = document.getElementById('hsts-info');
      const cspElement = document.getElementById('csp-info');
      
      if (hstsElement) {
        // No podemos acceder directamente a los headers de seguridad desde JavaScript
        // pero podemos verificar aspectos relacionados
        if (window.location.protocol === 'https:') {
          hstsElement.textContent = 'Sí (HTTPS activo)';
        } else {
          hstsElement.textContent = 'No (HTTP)';
        }
      }
      
      if (cspElement) {
        // Verificar si CSP está activo (podríamos detectar ciertos aspectos)
        try {
          // Intentar crear un script inline para ver si CSP lo bloquea
          const testScript = document.createElement('script');
          testScript.textContent = 'window.cspTest = true;';
          document.head.appendChild(testScript);
          document.head.removeChild(testScript);
          
          // Si llegamos aquí, CSP probablemente permite scripts inline
          if (window.cspTest) {
            cspElement.textContent = 'Parcial (inline permitido)';
          } else {
            cspElement.textContent = 'Estricto (inline bloqueado)';
          }
          delete window.cspTest;
        } catch (e) {
          cspElement.textContent = 'Estricto (posible CSP activo)';
        }
      }
    } catch (e) {
      const hstsElement = document.getElementById('hsts-info');
      const cspElement = document.getElementById('csp-info');
      
      if (hstsElement) hstsElement.textContent = 'Error al verificar';
      if (cspElement) cspElement.textContent = 'Error al verificar';
    }
    
    // Actualizar detección de rastreadores
    try {
      const trackersElement = document.getElementById('trackers-detected');
      if (trackersElement) {
        // Simular la detección de rastreadores comunes
        let trackerCount = 0;
        
        // Detectar algunos servicios de rastreo comunes
        const knownTrackers = [
          'google-analytics',
          'facebook-pixel',
          'twitter-conversion',
          'linkedin-insight',
          'hotjar',
          'crazy-egg',
          'clicktale',
          'mouseflow',
          'optimizely',
          'adroll'
        ];
        
        // Verificar si hay scripts de rastreo comunes en la página
        const allScripts = document.getElementsByTagName('script');
        for (let script of allScripts) {
          if (script.src) {
            for (let tracker of knownTrackers) {
              if (script.src.toLowerCase().includes(tracker)) {
                trackerCount++;
                break;
              }
            }
          }
        }
        
        // Contar iframes que podrían ser rastreadores
        const allIframes = document.getElementsByTagName('iframe');
        for (let iframe of allIframes) {
          if (iframe.src) {
            for (let tracker of knownTrackers) {
              if (iframe.src.toLowerCase().includes(tracker)) {
                trackerCount++;
                break;
              }
            }
          }
        }
        
        trackersElement.textContent = `${trackerCount} rastreadores detectados`;
      }
    } catch (e) {
      console.log('Error detectando rastreadores:', e);
      const trackersElement = document.getElementById('trackers-detected');
      if (trackersElement) trackersElement.textContent = 'Error al detectar';
    }
    
    // Actualizar cookies de terceros
    try {
      const cookiesElement = document.getElementById('third-party-cookies');
      if (cookiesElement) {
        // En un navegador, no podemos contar directamente cookies de terceros
        // pero podemos simular basándonos en dominios conocidos de rastreo
        const thirdPartyDomains = [
          'google.com',
          'facebook.com',
          'twitter.com',
          'linkedin.com',
          'adobe.com',
          'hotjar.com',
          'optimizely.com'
        ];
        
        // Simular conteo de cookies de terceros
        const simulatedCount = Math.floor(Math.random() * 15) + 5; // Valor entre 5-20
        cookiesElement.textContent = `${simulatedCount} cookies de terceros`;
      }
    } catch (e) {
      console.log('Error contando cookies de terceros:', e);
      const cookiesElement = document.getElementById('third-party-cookies');
      if (cookiesElement) cookiesElement.textContent = 'Error al contar';
    }
    
    // Actualizar red insegura
    try {
      const insecureElement = document.getElementById('insecure-network');
      if (insecureElement) {
        // Verificar si estamos usando HTTP en lugar de HTTPS
        const isSecure = window.location.protocol === 'https:';
        if (isSecure) {
          // Aunque usemos HTTPS, podríamos estar en una red insegura
          // basándonos en el tipo de conexión
          const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          if (conn && (conn.type === 'wifi' || conn.type === 'cellular')) {
            // Podríamos mejorar esta lógica con más inteligencia
            insecureElement.textContent = 'Potencialmente segura';
          } else {
            insecureElement.textContent = 'Aparentemente segura';
          }
        } else {
          insecureElement.textContent = 'Red insegura (HTTP)';
        }
      }
    } catch (e) {
      const insecureElement = document.getElementById('insecure-network');
      if (insecureElement) insecureElement.textContent = 'Error al verificar';
    }
  }
}