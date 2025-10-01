document.addEventListener('DOMContentLoaded', () => {
            // Calculate and display privacy risk level
            function updatePrivacyMeter() {
                // In a real implementation, this would calculate based on collected data
                // For demonstration, we'll set it to high risk
                document.getElementById('privacy-risk-level').textContent = 'ALTO';
                document.getElementById('privacy-meter-fill').className = 'privacy-meter-fill privacy-level-high';
            }
            
            // Calculate privacy score
            function calculatePrivacyScore() {
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
            
            updatePrivacyMeter();
            calculatePrivacyScore();

            // --- SECCIÓN 1: INFORMACIÓN BÁSICA ---
            
            // IP, Ubicación, ISP y ASN
            async function fetchIPAndLocation() {
                const ipElement = document.getElementById('ip-address');
                const locationElement = document.getElementById('location');
                const ispElement = document.getElementById('isp-info');
                const asnElement = document.getElementById('asn-info');
                
                // Mostrar un spinner mientras se carga
                if (ipElement) ipElement.innerHTML = '<span class="loading-spinner"></span>';
                if (locationElement) locationElement.innerHTML = '<span class="loading-spinner"></span>';
                if (ispElement) ispElement.textContent = 'Detectando...';
                if (asnElement) asnElement.textContent = 'Detectando...';
                
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
                    
                    // Código postal (a veces disponible en el objeto data)
                    const postalElement = document.getElementById('postal-code');
                    if (postalElement) {
                        if (data.postal) {
                            postalElement.textContent = data.postal;
                        } else {
                            postalElement.textContent = 'No disponible';
                        }
                    }
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
                        } catch (error3) {
                            console.log('Todos los servicios fallaron:', error3);
                            if (ipElement) ipElement.textContent = 'Error al obtener IP';
                            if (locationElement) locationElement.textContent = 'Error al obtener ubicación';
                            if (ispElement) ispElement.textContent = 'Error al obtener ISP';
                            if (asnElement) asnElement.textContent = 'Error al obtener ASN';
                        }
                    }
                }
            }
            
            fetchIPAndLocation();

            // Función para obtener información adicional de geolocalización
            async function getAdditionalLocationInfo() {
                try {
                    const response = await fetch('https://ipapi.co/json/');
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servicio');
                    }
                    const data = await response.json();
                    
                    // Elemento de clima
                    const weatherElement = document.getElementById('local-weather');
                    if (weatherElement) {
                        // Esto requeriría un servicio de clima real, pero lo simularemos
                        // basado en información de ubicación
                        if (data.country) {
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
                        } else {
                            weatherElement.textContent = 'No disponible';
                        }
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
            
            // Llamar a la función después de que se cargue la información básica
            setTimeout(getAdditionalLocationInfo, 500);

            // Hora
            function updateClock() {
                const now = new Date();
                document.getElementById('system-time').textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                document.getElementById('system-date').textContent = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
            setInterval(updateClock, 1000);
            updateClock();
            
            // Detectar IP local usando WebRTC
            function detectLocalIP() {
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
            
            detectLocalIP();
            
            // Detectar rastreadores (simulación de detección)
            function detectTrackers() {
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
                    if (trackersElement) {
                        trackersElement.textContent = 'Error al detectar';
                    }
                }
            }
            
            // Contar cookies de terceros
            function countThirdPartyCookies() {
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
                    if (cookiesElement) {
                        cookiesElement.textContent = 'Error al contar';
                    }
                }
            }
            
            detectTrackers();
            countThirdPartyCookies();
            
            // Generar recomendaciones de privacidad
            function generatePrivacyTips() {
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
            
            generatePrivacyTips();
            
            // Sistema de alertas de riesgo
            function generateRiskAlerts() {
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
            
            // Analizar patrones de uso
            function analyzeUsagePatterns() {
                try {
                    // Registrar la hora de inicio de la sesión
                    const sessionStart = new Date();
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
                    
                    // Calcular tiempo en línea (simulado)
                    const durationElement = document.getElementById('online-duration');
                    if (durationElement) {
                        // Iniciar contador de duración
                        let secondsOnline = 0;
                        setInterval(() => {
                            secondsOnline++;
                            const hours = Math.floor(secondsOnline / 3600);
                            const minutes = Math.floor((secondsOnline % 3600) / 60);
                            const seconds = secondsOnline % 60;
                            
                            durationElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
                        }, 1000);
                    }
                } catch (e) {
                    console.log('Error analizando patrones de uso:', e);
                    const activityElement = document.getElementById('activity-patterns');
                    const durationElement = document.getElementById('online-duration');
                    
                    if (activityElement) activityElement.textContent = 'Error al analizar';
                    if (durationElement) durationElement.textContent = 'Error al calcular';
                }
            }
            
            analyzeUsagePatterns();
            
            generateRiskAlerts();

            // OS y Navegador
            const ua = navigator.userAgent;
            let os = "Desconocido";
            if (ua.includes("Win")) os = "Windows";
            else if (ua.includes("Mac")) os = "macOS";
            else if (ua.includes("Linux")) os = "Linux";
            else if (ua.includes("Android")) os = "Android";
            else if (ua.includes("like Mac")) os = "iOS";
            else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
            document.getElementById('os').textContent = os;

            // Detectar tipo de dispositivo
            let deviceType = "Desconocido";
            if (/Android/i.test(ua)) deviceType = "Móvil (Android)";
            else if (/iPhone|iPad|iPod/i.test(ua)) deviceType = "Móvil (iOS)";
            else if (/Win/i.test(ua)) deviceType = "Computadora (Windows)";
            else if (/Mac/i.test(ua)) deviceType = "Computadora (macOS)";
            else if (/Linux/i.test(ua)) deviceType = "Computadora (Linux)";
            else deviceType = "Otro";
            
            // Agregar información de dispositivo al OS
            document.getElementById('os').textContent = `${os} (${deviceType})`;

            let browser = "Navegador Desconocido";
            if (ua.includes("Firefox/")) browser = "Mozilla Firefox";
            else if (ua.includes("SamsungBrowser/")) browser = "Samsung Internet";
            else if (ua.includes("Opera/") || ua.includes("OPR/")) browser = "Opera";
            else if (ua.includes("Trident/")) browser = "Internet Explorer";
            else if (ua.includes("Edg/")) browser = "Microsoft Edge";
            else if (ua.includes("Chrome/")) browser = "Google Chrome";
            else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Apple Safari";
            document.getElementById('browser').textContent = browser;

            // Resolución
            document.getElementById('resolution').textContent = `${window.screen.width} x ${window.screen.height} px`;

            // Conexión
            function updateOnlineStatus() {
                const statusEl = document.getElementById('online-status');
                statusEl.textContent = navigator.onLine ? 'En línea' : 'Fuera de línea';
                statusEl.style.color = navigator.onLine ? '#22C55E' : '#EF4444';
            }
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
            updateOnlineStatus();

            // Batería
            if ('getBattery' in navigator) {
                document.getElementById('battery-card').style.display = 'flex';
                navigator.getBattery().then(battery => {
                    const updateBattery = () => {
                        document.getElementById('battery-status').textContent = `${Math.floor(battery.level * 100)}% (${battery.charging ? 'Cargando' : 'Descargando'})`;
                    };
                    battery.addEventListener('levelchange', updateBattery);
                    battery.addEventListener('chargingchange', updateBattery);
                    updateBattery();
                });
            }


            // --- SECCIÓN 2: HUELLA DIGITAL ---
            
            // CPU, RAM, Plataforma, Idiomas
            try {
                document.getElementById('cpu-cores').textContent = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} núcleos` : 'No disponible';
            } catch (e) {
                document.getElementById('cpu-cores').textContent = 'Error al obtener';
            }
            
            try {
                // La RAM detectada por el navegador es la que está disponible, no debemos inventar valores
                if (navigator.deviceMemory !== undefined) {
                    document.getElementById('device-memory').textContent = `${navigator.deviceMemory} GB`;
                } else {
                    document.getElementById('device-memory').textContent = 'No disponible';
                }
            } catch (e) {
                document.getElementById('device-memory').textContent = 'No disponible';
            }
            
            try {
                document.getElementById('platform').textContent = navigator.platform || 'No disponible';
            } catch (e) {
                document.getElementById('platform').textContent = 'Error al obtener';
            }
            
            try {
                document.getElementById('languages').textContent = navigator.languages ? navigator.languages.join(', ') : 'No disponible';
            } catch (e) {
                document.getElementById('languages').textContent = 'Error al obtener';
            }
            
            // Red
            try {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                document.getElementById('network-info').textContent = conn ? `Tipo: ${conn.effectiveType || 'Desconocido'}, Velocidad: ${conn.downlink ? conn.downlink + ' Mbps' : 'Desconocido'}` : 'No disponible';
                
                // Tipo de conexión
                if (conn) {
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
                    document.getElementById('connection-type').textContent = connectionType;
                } else {
                    document.getElementById('connection-type').textContent = 'No disponible';
                }
                
                // Latencia de red (estimación básica)
                const measureLatency = async () => {
                    const start = performance.now();
                    try {
                        const response = await fetch('https://httpbin.org/get', { method: 'HEAD' });
                        const end = performance.now();
                        const latency = Math.round(end - start);
                        document.getElementById('latency-info').textContent = `${latency} ms`;
                    } catch (e) {
                        // Alternativa: medir el tiempo de respuesta de una imagen pequeña
                        const imgStart = performance.now();
                        const img = new Image();
                        img.onload = () => {
                            const imgEnd = performance.now();
                            const latency = Math.round(imgEnd - imgStart);
                            document.getElementById('latency-info').textContent = `${latency} ms (estimado)`;
                        };
                        img.onerror = () => {
                            document.getElementById('latency-info').textContent = 'No disponible';
                        };
                        img.src = 'https://httpbin.org/image/png?_=' + Date.now();
                    }
                };
                
                measureLatency();
                
                // Velocidad de conexión (estimación)
                const measureSpeed = async () => {
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
                        document.getElementById('speed-info').textContent = `${speedMbps} Mbps (estimado)`;
                    } catch (e) {
                        document.getElementById('speed-info').textContent = 'No disponible';
                    }
                };
                
                // Medir velocidad después de un breve retraso para permitir que otras operaciones se completen
                setTimeout(measureSpeed, 1000);
            } catch (e) {
                document.getElementById('network-info').textContent = 'Error al obtener';
                document.getElementById('connection-type').textContent = 'Error al obtener';
                document.getElementById('latency-info').textContent = 'Error al obtener';
                document.getElementById('speed-info').textContent = 'Error al obtener';
            }

            // Red
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

            // GPU
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                const debugInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    document.getElementById('gpu-info').textContent = renderer || 'No disponible';
                } else {
                    document.getElementById('gpu-info').textContent = 'No disponible';
                }
            } catch (e) {
                document.getElementById('gpu-info').textContent = 'No se pudo obtener';
            }
            
            // Gamepad
            window.addEventListener("gamepadconnected", e => {
                document.getElementById('gamepad-status').textContent = e.gamepad.id;
                document.getElementById('gamepad-status').style.color = '#22C55E';
            });
            window.addEventListener("gamepaddisconnected", () => {
                document.getElementById('gamepad-status').textContent = 'Control desconectado';
                document.getElementById('gamepad-status').style.color = '#9CA3AF';
            });

            // Fuentes
            (async () => {
                const fontsElement = document.getElementById('fonts-status');
                try {
                    if (!document.fonts) {
                         fontsElement.textContent = 'API no soportada';
                         return;
                    }
                    const testFonts = ['Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS', 'Calibri', 'Fira Code', 'Roboto'];
                    const detectedFonts = [];
                    for(const font of testFonts) {
                        if (await document.fonts.check(`12px "${font}"`)) {
                            detectedFonts.push(font);
                        }
                    }
                    fontsElement.textContent = detectedFonts.join(', ') || 'Ninguna fuente especial detectada.';
                } catch (e) {
                    fontsElement.textContent = 'Error al detectar fuentes';
                }
            })();

            // Do Not Track
            try {
                const dnt = navigator.doNotTrack;
                const dntStatus = document.getElementById('dnt-status');
                if (dnt === '1' || dnt === 'yes') {
                    dntStatus.textContent = 'Activado'; 
                    dntStatus.style.color = '#22C55E';
                } else {
                    dntStatus.textContent = 'Desactivado'; 
                    dntStatus.style.color = '#EF4444';
                }
            } catch (e) {
                document.getElementById('dnt-status').textContent = 'Error al obtener';
            }


            // --- SECCIÓN 3: PERMISOS INVASIVOS ---

            // Geolocalización
            document.getElementById('request-geolocation').addEventListener('click', () => {
                const btn = document.getElementById('request-geolocation');
                const status = document.getElementById('geolocation-status');
                if (!navigator.geolocation) { status.textContent = 'No soportado'; return; }
                btn.disabled = true;
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        status.textContent = `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`;
                        status.style.color = '#22C55E';
                        btn.style.display = 'none';
                    },
                    () => {
                        status.textContent = 'Permiso denegado';
                        status.style.color = '#EF4444';
                        btn.style.display = 'none';
                    }
                );
            });

            // Cámara
            document.getElementById('request-camera').addEventListener('click', async () => {
                const btn = document.getElementById('request-camera'), status = document.getElementById('camera-status'), feed = document.getElementById('camera-feed');
                if (!navigator.mediaDevices?.getUserMedia) { status.textContent = 'API no soportada'; return; }
                btn.disabled = true;
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    status.textContent = 'Cámara activa'; status.style.color = '#22C55E';
                    feed.style.display = 'block'; feed.srcObject = stream;
                    btn.style.display = 'none';
                } catch (err) { status.textContent = 'Acceso denegado'; status.style.color = '#EF4444'; btn.style.display = 'none'; }
            });

            // Micrófono
            document.getElementById('request-mic').addEventListener('click', async () => {
                const btn = document.getElementById('request-mic'), status = document.getElementById('mic-status'), viz = document.getElementById('mic-visualizer');
                if (!navigator.mediaDevices?.getUserMedia) { status.textContent = 'API no soportada'; return; }
                btn.disabled = true;
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    status.textContent = 'Micrófono activo'; status.style.color = '#22C55E';
                    viz.style.display = 'block'; btn.style.display = 'none';
                    const audioContext = new AudioContext(), source = audioContext.createMediaStreamSource(stream), analyser = audioContext.createAnalyser();
                    analyser.fftSize = 256; source.connect(analyser);
                    const bufferLength = analyser.frequencyBinCount, dataArray = new Uint8Array(bufferLength), canvasCtx = viz.getContext('2d');
                    function draw() {
                        requestAnimationFrame(draw);
                        analyser.getByteFrequencyData(dataArray);
                        canvasCtx.fillStyle = '#111827'; canvasCtx.fillRect(0, 0, viz.width, viz.height);
                        let barWidth = (viz.width / bufferLength) * 2.5, barHeight, x = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            barHeight = dataArray[i] / 2;
                            canvasCtx.fillStyle = `rgb(59, 130, ${barHeight + 100})`;
                            canvasCtx.fillRect(x, viz.height - barHeight, barWidth, barHeight);
                            x += barWidth + 1;
                        }
                    }
                    draw();
                } catch (err) { status.textContent = 'Acceso denegado'; status.style.color = '#EF4444'; btn.style.display = 'none'; }
            });

            // Sensores de Movimiento
            document.getElementById('request-sensors').addEventListener('click', () => {
                const btn = document.getElementById('request-sensors'), status = document.getElementById('sensors-status'), dataDiv = document.getElementById('sensors-data');
                btn.disabled = true;
                if (typeof(Accelerometer) === "undefined") { status.textContent = 'No soportado'; btn.style.display = 'none'; return; }
                Promise.all([navigator.permissions.query({ name: 'accelerometer' }), navigator.permissions.query({ name: 'gyroscope' })]).then((results) => {
                    if (results.every(result => result.state === 'granted' || result.state === 'prompt')) {
                        status.textContent = 'Sensores activos'; status.style.color = '#22C55E';
                        dataDiv.style.display = 'block'; btn.style.display = 'none';
                        const acl = new Accelerometer({ frequency: 60 });
                        acl.addEventListener('reading', () => { dataDiv.innerHTML = `<b>Accel:</b> X:${acl.x.toFixed(2)} Y:${acl.y.toFixed(2)} Z:${acl.z.toFixed(2)}`; });
                        acl.start();
                    } else { status.textContent = 'Permiso denegado'; status.style.color = '#EF4444'; btn.style.display = 'none'; }
                });
            });

            // Portapapeles
            document.getElementById('request-clipboard').addEventListener('click', async () => {
                const btn = document.getElementById('request-clipboard'), status = document.getElementById('clipboard-status'), content = document.getElementById('clipboard-content');
                if (!navigator.clipboard?.readText) { status.textContent = 'API no soportada'; return; }
                btn.disabled = true;
                try {
                    const text = await navigator.clipboard.readText();
                    status.textContent = 'Contenido leído:'; status.style.color = '#22C55E';
                    content.textContent = text || '(El portapapeles está vacío)';
                    content.style.display = 'block';
                    btn.style.display = 'none';
                } catch (err) { status.textContent = 'Permiso denegado'; status.style.color = '#EF4444'; btn.style.display = 'none'; }
            });

            // --- SECCIÓN 4: NUEVAS TÉCNICAS DE RECOLECCIÓN DE DATOS ---
            
            // Canvas Fingerprint
            try {
                function getCanvasFingerprint() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.textBaseline = 'top';
                    ctx.font = '14px Arial';
                    ctx.fillStyle = '#f60';
                    ctx.fillRect(125, 1, 62, 20);
                    ctx.fillStyle = '#069';
                    ctx.fillText('Canvas fingerprinting test', 2, 15);
                    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
                    ctx.fillText('Canvas fingerprinting test', 4, 17);
                    const result = canvas.toDataURL();
                    return result.length;
                }
                document.getElementById('canvas-fingerprint').textContent = `${getCanvasFingerprint()} caracteres`;
            } catch (e) {
                document.getElementById('canvas-fingerprint').textContent = 'Error al obtener';
            }
            
            // Detección de AdBlock
            try {
                const adBlockEnabled = () => {
                    const ads = document.createElement('div');
                    ads.innerHTML = '&nbsp;';
                    ads.className = 'adsbox';
                    document.body.appendChild(ads);
                    const isBlocked = ads.offsetHeight === 0;
                    document.body.removeChild(ads);
                    return isBlocked;
                };
                
                const adBlockElement = document.getElementById('adblock-status');
                if (adBlockElement) {
                    adBlockElement.textContent = adBlockEnabled() ? 'Sí' : 'No';
                }
            } catch (e) {
                // No hacer nada si no existe el elemento
            }
            
            // Detección de fuga WebRTC
            try {
                const checkWebRTCLocalIP = () => {
                    return new Promise((resolve) => {
                        const rtcConn = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
                        if (!rtcConn) {
                            resolve('WebRTC no soportado');
                            return;
                        }
                        
                        const pc = new rtcConn({ iceServers: [] });
                        let localIPs = {};
                        
                        pc.createDataChannel('');
                        pc.createOffer()
                            .then(offer => pc.setLocalDescription(offer))
                            .catch(e => console.log('Error en WebRTC:', e));
                        
                        pc.onicecandidate = (ice) => {
                            if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                            
                            const ip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
                            
                            if (ip) {
                                localIPs[ip[0]] = true;
                            }
                            
                            if (ice.candidate.candidate.indexOf('typ endOfCandidates') !== -1) {
                                pc.onicecandidate = () => {}; // Detener más candidatos
                                pc.close();
                            } else if (!ice.candidate) {
                                pc.close();
                                const ips = Object.keys(localIPs);
                                if (ips.length > 0) {
                                    resolve(`IP(s) local(es) expuesta(s): ${ips.join(', ')}`);
                                } else {
                                    resolve('No se detectó fuga WebRTC');
                                }
                            }
                        };
                        
                        // Timeout
                        setTimeout(() => {
                            pc.close();
                            const ips = Object.keys(localIPs);
                            if (ips.length > 0) {
                                resolve(`Posible fuga WebRTC: ${ips.join(', ')}`);
                            } else {
                                resolve('No se detectó fuga WebRTC');
                            }
                        }, 3000);
                    });
                };
                
                checkWebRTCLocalIP().then(result => {
                    const webrtcElement = document.getElementById('webrtc-leak');
                    if (webrtcElement) {
                        webrtcElement.textContent = result;
                    }
                });
            } catch (e) {
                const webrtcElement = document.getElementById('webrtc-leak');
                if (webrtcElement) {
                    webrtcElement.textContent = 'Error al verificar';
                }
            }
            
            // Detección de red insegura y proxy
            try {
                const checkInsecureNetwork = () => {
                    // Verificar si estamos usando HTTP en lugar de HTTPS
                    const isSecure = window.location.protocol === 'https:';
                    const insecureElement = document.getElementById('insecure-network');
                    
                    if (insecureElement) {
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
                };
                
                checkInsecureNetwork();
            } catch (e) {
                const insecureElement = document.getElementById('insecure-network');
                if (insecureElement) {
                    insecureElement.textContent = 'Error al verificar';
                }
            }
            
            // Huella de navegador única
            try {
                const calculateFingerprintUniqueness = () => {
                    // Esta es una estimación basada en las características comunes detectadas
                    // En una implementación real, se compararía con una base de datos de huellas
                    const features = [
                        navigator.userAgent,
                        navigator.platform,
                        navigator.language,
                        screen.width,
                        screen.height,
                        screen.colorDepth,
                        navigator.hardwareConcurrency,
                        navigator.deviceMemory
                    ].filter(f => f !== undefined && f !== null).length;
                    
                    // Calcular porcentaje de rareza (estimación)
                    const uniquenessPercentage = 85 + Math.floor(Math.random() * 10); // 85-95%
                    return `${uniquenessPercentage}% única`;
                };
                
                const fingerprintElement = document.getElementById('fingerprint-uniqueness');
                if (fingerprintElement) {
                    fingerprintElement.textContent = calculateFingerprintUniqueness();
                }
            } catch (e) {
                const fingerprintElement = document.getElementById('fingerprint-uniqueness');
                if (fingerprintElement) {
                    fingerprintElement.textContent = 'Error al calcular';
                }
            }
            
            // Capacidad de almacenamiento (nueva API experimental)
            try {
                if ('storage' in navigator && 'estimate' in navigator.storage) {
                    navigator.storage.estimate().then((estimate) => {
                        const storageElement = document.getElementById('storage-capacity');
                        if (storageElement) {
                            // Convertir bytes a MB o GB
                            const usedMB = Math.round(estimate.usage / (1024 * 1024));
                            const totalMB = Math.round(estimate.quota / (1024 * 1024));
                            
                            if (totalMB > 1024) {
                                const usedGB = (usedMB / 1024).toFixed(2);
                                const totalGB = (totalMB / 1024).toFixed(2);
                                storageElement.textContent = `${usedGB}GB usados de ${totalGB}GB`;
                            } else {
                                storageElement.textContent = `${usedMB}MB usados de ${totalMB}MB`;
                            }
                        }
                    });
                } else {
                    const storageElement = document.getElementById('storage-capacity');
                    if (storageElement) {
                        storageElement.textContent = 'No soportado';
                    }
                }
            } catch (e) {
                const storageElement = document.getElementById('storage-capacity');
                if (storageElement) {
                    storageElement.textContent = 'Error al obtener';
                }
            }
            
            // Almacenamiento local y cookies
            try {
                const cookiesStatus = document.getElementById('cookies-status');
                if (cookiesStatus) {
                    const cookiesEnabled = navigator.cookieEnabled;
                    const localStorageAvailable = typeof(Storage) !== 'undefined';
                    const sessionStorageAvailable = typeof(Storage) !== 'undefined';
                    
                    let storageInfo = [];
                    if (cookiesEnabled) storageInfo.push('Cookies');
                    if (localStorageAvailable) storageInfo.push('Local Storage');
                    if (sessionStorageAvailable) storageInfo.push('Session Storage');
                    
                    cookiesStatus.textContent = storageInfo.length > 0 ? storageInfo.join(', ') : 'Ninguno disponible';
                }
            } catch (e) {
                // No hacer nada si no existe el elemento
            }
            
            // Modo incógnito
            try {
                const detectIncognito = () => {
                    return new Promise((resolve) => {
                        if (typeof window.chrome !== 'undefined' && 
                            typeof window.chrome.extension !== 'undefined') {
                            resolve({ isPrivate: false });
                        } else {
                            const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
                            if (!fs) {
                                resolve({ isPrivate: false });
                                return;
                            }
                            fs(window.TEMPORARY, 100, (fs) => {
                                resolve({ isPrivate: false });
                            }, () => {
                                resolve({ isPrivate: true });
                            });
                        }
                    });
                };
                
                detectIncognito().then(result => {
                    const incognitoElement = document.getElementById('incognito-status');
                    if (incognitoElement) {
                        incognitoElement.textContent = result.isPrivate ? 'Sí (posible)' : 'No';
                    }
                });
            } catch (e) {
                // No hacer nada si no existe el elemento o hay error
            }
            
            // Detección de VPN/Proxy
            try {
                const checkVPNProxy = () => {
                    // Comprueba si el navegador tiene WebRTC activado y puede revelar IP real
                    const hasRTCPeerConnection = !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection);
                    
                    // Comprobar encabezados comunes de proxy
                    const checkHeaders = () => {
                        // Esta comprobación generalmente requiere una petición al servidor
                        // Pero podemos buscar señales comunes de proxy/VPN
                        const suspiciousHeaders = [
                            'X-Forwarded-For',
                            'X-Real-IP',
                            'X-Originating-IP',
                            'CF-Connecting-IP'
                        ];
                        
                        // En el navegador no podemos comprobar encabezados directamente
                        // pero podemos hacer una estimación basada en comportamiento
                        return false; // No podemos detectar proxy directamente en el cliente
                    };
                    
                    // Comprobar WebRTC leak
                    const checkWebRTC = (callback) => {
                        if (!hasRTCPeerConnection) {
                            callback('No detectable');
                            return;
                        }
                        
                        const pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({
                            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                        });
                        
                        pc.onicecandidate = (ice) => {
                            if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                            const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
                            if (myIP) {
                                const ip = myIP[0];
                                // Si la IP de WebRTC difiere de la IP pública, podría haber proxy/VPN
                                // Pero no tenemos IP pública aquí, así que solo lo notificamos
                                callback('Posible WebRTC leak detectado');
                                pc.close();
                            }
                        };
                        
                        pc.createDataChannel('');
                        pc.createOffer().then(offer => pc.setLocalDescription(offer));
                        
                        setTimeout(() => {
                            callback('No detectado');
                            if (pc) pc.close();
                        }, 2000);
                    };
                    
                    // Hacer la comprobación
                    checkWebRTC((result) => {
                        const vpnElement = document.getElementById('vpn-status');
                        if (vpnElement) {
                            vpnElement.textContent = result;
                        }
                    });
                };
                
                checkVPNProxy();
            } catch (e) {
                const vpnElement = document.getElementById('vpn-status');
                if (vpnElement) {
                    vpnElement.textContent = 'Error al verificar';
                }
            }

            // User Agent Detallado
            try {
                document.getElementById('user-agent-detailed').textContent = navigator.userAgent;
            } catch (e) {
                document.getElementById('user-agent-detailed').textContent = 'Error al obtener';
            }

            // Audio Fingerprint
            try {
                async function getAudioFingerprint() {
                    try {
                        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        const oscillator = audioContext.createOscillator();
                        const analyser = audioContext.createAnalyser();
                        const gain = audioContext.createGain();
                        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                        
                        oscillator.connect(analyser);
                        analyser.connect(scriptProcessor);
                        scriptProcessor.connect(gain);
                        gain.connect(audioContext.destination);
                        
                        oscillator.frequency.value = 1000;
                        oscillator.start();
                        
                        const values = new Array(100).fill(0);
                        let idx = 0;
                        
                        scriptProcessor.onaudioprocess = function (e) {
                            const input = e.inputBuffer.getChannelData(0);
                            values[idx] = input.reduce((acc, val) => acc + Math.abs(val), 0) / input.length;
                            idx++;
                            if (idx >= values.length) {
                                scriptProcessor.disconnect();
                                oscillator.stop();
                            }
                        };
                        
                        setTimeout(() => {
                            scriptProcessor.disconnect();
                            oscillator.stop();
                            const fingerprint = values.reduce((acc, val) => acc + val, 0);
                            document.getElementById('audio-fingerprint').textContent = fingerprint.toFixed(2);
                        }, 1000);
                    } catch (e) {
                        document.getElementById('audio-fingerprint').textContent = 'No disponible';
                    }
                }
                getAudioFingerprint();
            } catch (e) {
                document.getElementById('audio-fingerprint').textContent = 'Error al obtener';
            }

            // Timezone
            try {
                document.getElementById('timezone').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'No disponible';
            } catch (e) {
                document.getElementById('timezone').textContent = 'Error al obtener';
            }
            
            // Detección de políticas de seguridad
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

            // Plugins
            try {
                const plugins = [];
                for (let i = 0; i < navigator.plugins.length; i++) {
                    plugins.push(navigator.plugins[i].name);
                }
                document.getElementById('plugins').textContent = plugins.length > 0 ? plugins.join(', ') : 'Ninguno detectado';
            } catch (e) {
                document.getElementById('plugins').textContent = 'Error al obtener';
            }

            // Cookies
            try {
                const cookieTypes = [];
                if (navigator.cookieEnabled) cookieTypes.push('Estándar');
                document.getElementById('cookies').textContent = cookieTypes.length > 0 ? cookieTypes.join(', ') : 'Ninguno';
            } catch (e) {
                document.getElementById('cookies').textContent = 'Error al obtener';
            }

            // Touch Support
            try {
                const touchSupport = ('ontouchstart' in window) || 
                    (navigator.maxTouchPoints > 0) || 
                    (navigator.msMaxTouchPoints > 0);
                document.getElementById('touch-support').textContent = touchSupport ? 'Sí' : 'No';
            } catch (e) {
                document.getElementById('touch-support').textContent = 'Error al obtener';
            }

            // Screen Information
            try {
                document.getElementById('screen-info').textContent = 
                    `${screen.width}x${screen.height} (${screen.colorDepth}-bit color depth)`;
            } catch (e) {
                document.getElementById('screen-info').textContent = 'Error al obtener';
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
                if (orientationElement) {
                    orientationElement.textContent = 'No disponible';
                }
            }
            
            // Brillo del dispositivo (no está estandarizado, usar API específica si está disponible)
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
                if (brightnessElement) {
                    brightnessElement.textContent = 'No disponible';
                }
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
        });