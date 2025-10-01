export class DeviceService {
  static sessionStart = new Date();
  static secondsOnline = 0;
  
  static init() {
    this.detectLocalIP();
    this.analyzeUsagePatterns();
    this.setupOnlineDurationCounter();
  }
  
  static detectLocalIP() {
    const localIpElement = document.getElementById('local-ip');
    if (!localIpElement) return;
    
    localIpElement.textContent = 'Detectando...';
    
    try {
      // Verificar si WebRTC es compatible
      const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      if (!RTCPeerConnection) {
        localIpElement.textContent = 'No soportado';
        return;
      }
      
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      pc.createDataChannel('');
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(e => console.error('Error en WebRTC:', e));
      
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
        if (myIP) {
          localIpElement.textContent = myIP[0];
          pc.onicecandidate = () => {}; // Detener más candidatos
          pc.close();
          return;
        }
      };
      
      // Timeout si no se encuentra la IP local
      setTimeout(() => {
        if (localIpElement.textContent === 'Detectando...') {
          localIpElement.textContent = 'No detectada';
          if (pc) pc.close();
        }
      }, 5000);
    } catch (e) {
      console.error('Error detectando IP local:', e);
      localIpElement.textContent = 'Error al detectar';
    }
  }
  
  static analyzeUsagePatterns() {
    try {
      // Registrar la hora de inicio de la sesión
      const sessionStart = this.sessionStart;
      const hour = sessionStart.getHours();
      
      // Analizar hora de uso
      let timeCategory = 'Desconocido';
      if (hour >= 6 && hour < 12) {
        timeCategory = 'Mañana';
      } else if (hour >= 12 && hour < 14) {
        timeCategory = 'Mediodía';
      } else if (hour >= 14 && hour < 18) {
        timeCategory = 'Tarde';
      } else if (hour >= 18 && hour < 22) {
        timeCategory = 'Noche';
      } else {
        timeCategory = 'Madrugada';
      }
      
      // Determinar patrón de uso
      const activityElement = document.getElementById('activity-patterns');
      if (activityElement) {
        activityElement.textContent = `Activo en ${timeCategory} (${hour}:00-${hour+1}:00)`;
      }
    } catch (e) {
      console.log('Error analizando patrones de uso:', e);
      const activityElement = document.getElementById('activity-patterns');
      
      if (activityElement) activityElement.textContent = 'Error al analizar';
    }
  }
  
  static setupOnlineDurationCounter() {
    const durationElement = document.getElementById('online-duration');
    if (!durationElement) return;
    
    // Iniciar contador de duración
    setInterval(() => {
      this.secondsOnline++;
      const hours = Math.floor(this.secondsOnline / 3600);
      const minutes = Math.floor((this.secondsOnline % 3600) / 60);
      const seconds = this.secondsOnline % 60;
      
      durationElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
  
  static updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('system-time');
    const dateElement = document.getElementById('system-date');
    
    if (timeElement) {
      timeElement.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    if (dateElement) {
      dateElement.textContent = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
  
  static updateDeviceInfo() {
    try {
      // Resolución de pantalla
      const resolutionElement = document.getElementById('resolution');
      if (resolutionElement) {
        resolutionElement.textContent = `${window.screen.width} x ${window.screen.height} px`;
      }
      
      // Sistema operativo
      const osElement = document.getElementById('os');
      if (osElement) {
        const ua = navigator.userAgent;
        let os = "Desconocido";
        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("like Mac")) os = "iOS";
        else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
        
        // Detectar tipo de dispositivo
        let deviceType = "Desconocido";
        if (/Android/i.test(ua)) deviceType = "Móvil (Android)";
        else if (/iPhone|iPad|iPod/i.test(ua)) deviceType = "Móvil (iOS)";
        else if (/Win/i.test(ua)) deviceType = "Computadora (Windows)";
        else if (/Mac/i.test(ua)) deviceType = "Computadora (macOS)";
        else if (/Linux/i.test(ua)) deviceType = "Computadora (Linux)";
        else deviceType = "Otro";
        
        osElement.textContent = `${os} (${deviceType})`;
      }
      
      // Navegador
      const browserElement = document.getElementById('browser');
      if (browserElement) {
        const ua = navigator.userAgent;
        let browser = "Navegador Desconocido";
        if (ua.includes("Firefox/")) browser = "Mozilla Firefox";
        else if (ua.includes("SamsungBrowser/")) browser = "Samsung Internet";
        else if (ua.includes("Opera/") || ua.includes("OPR/")) browser = "Opera";
        else if (ua.includes("Trident/")) browser = "Internet Explorer";
        else if (ua.includes("Edg/")) browser = "Microsoft Edge";
        else if (ua.includes("Chrome/")) browser = "Google Chrome";
        else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Apple Safari";
        browserElement.textContent = browser;
      }
      
      // Estado de conexión
      const onlineStatusElement = document.getElementById('online-status');
      if (onlineStatusElement) {
        onlineStatusElement.textContent = navigator.onLine ? 'En línea' : 'Fuera de línea';
        onlineStatusElement.style.color = navigator.onLine ? '#22C55E' : '#EF4444';
      }
      
      // Batería
      if ('getBattery' in navigator) {
        const batteryCard = document.getElementById('battery-card');
        if (batteryCard) batteryCard.style.display = 'flex';
        navigator.getBattery().then(battery => {
          const updateBattery = () => {
            const batteryStatusElement = document.getElementById('battery-status');
            if (batteryStatusElement) {
              batteryStatusElement.textContent = `${Math.floor(battery.level * 100)}% (${battery.charging ? 'Cargando' : 'Descargando'})`;
            }
          };
          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);
          updateBattery();
        });
      }
      
      // Huella digital
      const cpuCoresElement = document.getElementById('cpu-cores');
      if (cpuCoresElement) {
        cpuCoresElement.textContent = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} núcleos` : 'No disponible';
      }
      
      const deviceMemoryElement = document.getElementById('device-memory');
      if (deviceMemoryElement) {
        deviceMemoryElement.textContent = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'No disponible';
      }
      
      const platformElement = document.getElementById('platform');
      if (platformElement) {
        platformElement.textContent = navigator.platform || 'No disponible';
      }
      
      const languagesElement = document.getElementById('languages');
      if (languagesElement) {
        languagesElement.textContent = navigator.languages ? navigator.languages.join(', ') : 'No disponible';
      }
      
      // GPU
      const gpuInfoElement = document.getElementById('gpu-info');
      if (gpuInfoElement) {
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          const debugInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            gpuInfoElement.textContent = renderer || 'No disponible';
          } else {
            gpuInfoElement.textContent = 'No disponible';
          }
        } catch (e) {
          gpuInfoElement.textContent = 'No se pudo obtener';
        }
      }
      
      // Gamepad
      window.addEventListener("gamepadconnected", e => {
        const gamepadStatusElement = document.getElementById('gamepad-status');
        if (gamepadStatusElement) {
          gamepadStatusElement.textContent = e.gamepad.id;
          gamepadStatusElement.style.color = '#22C55E';
        }
      });
      window.addEventListener("gamepaddisconnected", () => {
        const gamepadStatusElement = document.getElementById('gamepad-status');
        if (gamepadStatusElement) {
          gamepadStatusElement.textContent = 'Control desconectado';
          gamepadStatusElement.style.color = '#9CA3AF';
        }
      });
      
      // Fuentes
      (async () => {
        const fontsElement = document.getElementById('fonts-status');
        try {
          if (!document.fonts) {
            if (fontsElement) fontsElement.textContent = 'API no soportada';
            return;
          }
          const testFonts = ['Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS', 'Calibri', 'Fira Code', 'Roboto'];
          const detectedFonts = [];
          for(const font of testFonts) {
            if (await document.fonts.check(`12px "${font}"`)) {
              detectedFonts.push(font);
            }
          }
          if (fontsElement) {
            fontsElement.textContent = detectedFonts.join(', ') || 'Ninguna fuente especial detectada.';
          }
        } catch (e) {
          if (fontsElement) fontsElement.textContent = 'Error al detectar fuentes';
        }
      })();
      
      // Do Not Track
      try {
        const dnt = navigator.doNotTrack;
        const dntStatusElement = document.getElementById('dnt-status');
        if (dntStatusElement) {
          if (dnt === '1' || dnt === 'yes') {
            dntStatusElement.textContent = 'Activado'; 
            dntStatusElement.style.color = '#22C55E';
          } else {
            dntStatusElement.textContent = 'Desactivado'; 
            dntStatusElement.style.color = '#EF4444';
          }
        }
      } catch (e) {
        const dntStatusElement = document.getElementById('dnt-status');
        if (dntStatusElement) dntStatusElement.textContent = 'Error al obtener';
      }
      
      // Orientación del dispositivo
      try {
        const orientationElement = document.getElementById('orientation-info');
        if (orientationElement) {
          // Determinar orientación basada en dimensiones de pantalla
          const orientation = screen.width > screen.height ? 'Horizontal' : 'Vertical';
          orientationElement.textContent = orientation;
          
          // Escuchar cambios de orientación si está disponible
          if (window.screen.orientation) {
            window.screen.orientation.addEventListener('change', () => {
              const newOrientation = screen.width > screen.height ? 'Horizontal' : 'Vertical';
              orientationElement.textContent = newOrientation;
            });
          }
        }
      } catch (e) {
        const orientationElement = document.getElementById('orientation-info');
        if (orientationElement) orientationElement.textContent = 'No disponible';
      }
      
      // Brillo del dispositivo
      try {
        const brightnessElement = document.getElementById('brightness-info');
        if (brightnessElement) {
          // Intentar usar la API experimental de brillo
          if ('screen' in window && 'brightness' in window.screen) {
            // Esta API no está ampliamente soportada, así que solo indicamos el estado
            brightnessElement.textContent = 'Soportado (valor no accesible)';
          } else {
            // Podríamos usar otras heurísticas, por ejemplo, si es un dispositivo móvil
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            brightnessElement.textContent = isMobile ? 'Dispositivo móvil detectado' : 'No disponible';
          }
        }
      } catch (e) {
        const brightnessElement = document.getElementById('brightness-info');
        if (brightnessElement) brightnessElement.textContent = 'No disponible';
      }
      
      // Detección de acelerómetro y giroscopio
      try {
        const accelerometerElement = document.getElementById('accelerometer-info');
        const gyroscopeElement = document.getElementById('gyroscope-info');
        
        if (accelerometerElement) {
          // Verificar si la API de acelerómetro está disponible
          if (typeof Accelerometer !== 'undefined') {
            accelerometerElement.textContent = 'Dispositivo móvil con acelerómetro';
          } else {
            // Intentar detectar a través de otras APIs
            if ('deviceorientation' in window || 'devicemotion' in window) {
              accelerometerElement.textContent = 'Dispositivo móvil (orientación soportada)';
            } else {
              accelerometerElement.textContent = 'No disponible';
            }
          }
        }
        
        if (gyroscopeElement) {
          // Verificar si la API de giroscopio está disponible
          if (typeof Gyroscope !== 'undefined') {
            gyroscopeElement.textContent = 'Dispositivo móvil con giroscopio';
          } else {
            // Intentar detectar a través de otras APIs
            if ('deviceorientation' in window || 'devicemotion' in window) {
              gyroscopeElement.textContent = 'Dispositivo móvil (movimiento soportado)';
            } else {
              gyroscopeElement.textContent = 'No disponible';
            }
          }
        }
      } catch (e) {
        const accelerometerElement = document.getElementById('accelerometer-info');
        const gyroscopeElement = document.getElementById('gyroscope-info');
        
        if (accelerometerElement) accelerometerElement.textContent = 'Error al detectar';
        if (gyroscopeElement) gyroscopeElement.textContent = 'Error al detectar';
      }
      
      // Screen Information
      try {
        const screenInfoElement = document.getElementById('screen-info');
        if (screenInfoElement) {
          screenInfoElement.textContent = 
            `${screen.width}x${screen.height} (${screen.colorDepth}-bit color depth)`;
        }
      } catch (e) {
        const screenInfoElement = document.getElementById('screen-info');
        if (screenInfoElement) screenInfoElement.textContent = 'Error al obtener';
      }
    } catch (e) {
      console.error('Error actualizando información del dispositivo:', e);
    }
  }
}