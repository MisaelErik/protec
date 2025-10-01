# Panel de Control de Privacidad

Esta aplicación web muestra toda la información que tu navegador comparte y puede recopilar sobre ti sin que te des cuenta.

## Características

- Muestra tu dirección IP pública
- Muestra tu ubicación aproximada (según la IP)
- Detalla información del sistema operativo y dispositivo
- Muestra información de hardware (CPU, RAM, GPU)
- Detalla la configuración del navegador
- Muestra información de red y conectividad
- Demuestra permisos invasivos (cámara, micrófono, geolocalización)
- Análisis avanzado de huella digital
- Detección de rastreadores y amenazas
- Recomendaciones personalizadas de privacidad

## Tecnologías

- **Vite** - Herramienta de construcción rápida
- **Vercel** - Plataforma de despliegue
- **ES Modules** - Módulos modernos de JavaScript
- **Service Workers** - Funcionalidad offline (PWA)
- **Web APIs** - APIs modernas del navegador

## Estructura del proyecto

```
public/
├── index.html              # Página principal
src/
├── main.js                 # Punto de entrada
├── App.js                  # Lógica principal
├── style.css               # Estilos
└── services/               # Módulos de funcionalidad
    ├── NetworkService.js   # Servicio de red
    ├── DeviceService.js    # Servicio de dispositivo
    ├── PrivacyService.js   # Servicio de privacidad
    ├── SecurityService.js  # Servicio de seguridad
    └── UIService.js        # Servicio de interfaz
package.json               # Dependencias y scripts
vite.config.js             # Configuración de Vite
vercel.json                # Configuración de Vercel
README.md                  # Este archivo
```

## Cómo desarrollar localmente

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`
4. Abre `http://localhost:3000` en tu navegador

## Cómo construir para producción

```bash
npm run build
```

Los archivos estáticos se generan en la carpeta `dist/`.

## Despliegue en Vercel

1. Asegúrate de tener una cuenta en [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto de Vite
4. Elige las configuraciones predeterminadas y despliega
5. Tu aplicación estará disponible en una URL como `https://tu-proyecto.vercel.app`

## Información que se recopila

### Información Básica del Dispositivo
- **Dirección IP**: Tu IP pública actual
- **Ubicación**: Ubicación aproximada según tu IP (ciudad, región, país)
- **Proveedor Internet (ISP)**: Nombre de la compañía de internet
- **Número ASN**: Número de Sistema Autónomo del proveedor
- **Código Postal**: Basado en la geolocalización
- **Clima Local**: Condiciones climáticas según ubicación
- **Moneda Local**: Sistema monetario de la región
- **Hora del Ordenador**: Fecha y hora actual en tiempo real
- **IP Local**: Dirección IP interna de tu red local
- **Sistema Operativo**: Sistema operativo y tipo de dispositivo
- **Navegador**: Navegador web que estás usando
- **Resolución de Pantalla**: Ancho y alto de tu pantalla
- **Tipo de Conexión**: Cable, fibra, 4G, 5G, etc.
- **Estado de Conexión**: Si estás en línea o fuera de línea
- **Batería**: Nivel de batería (si está disponible)

### Huella Digital y Datos Expuestos
- **Núcleos del CPU**: Número de núcleos del procesador
- **Memoria (RAM)**: Cantidad aproximada de RAM
- **Tarjeta Gráfica (GPU)**: Información del procesador gráfico
- **Plataforma**: Información de la plataforma subyacente
- **Idiomas Preferidos**: Idiomas configurados en el navegador
- **Info. de Red**: Tipo de conexión, velocidad, latencia
- **Velocidad de Conexión**: Medición de velocidad de descarga
- **Fuentes Instaladas**: Fuentes detectadas en el sistema
- **Señal "No Rastrear"**: Si tienes activado el indicador DNT
- **Canvas Fingerprint**: Huella digital basada en canvas
- **Huella de Audio**: Perfil único basado en audio
- **Huella de Navegador**: Único por combinación de características

### Permisos Invasivos
- **Geolocalización Precisa**: Ubicación exacta con tu permiso
- **Acceso a Cámara**: Para tomar fotos o video
- **Acceso a Micrófono**: Para grabar audio
- **Sensores de Movimiento**: Acelerómetro y giroscopio
- **Acceso al Portapapeles**: Leer contenido del portapapeles

### Análisis de Privacidad
- **Puntuación de Privacidad**: Valoración basada en configuración
- **Riesgo Comparado**: Cómo te comparas con otros usuarios
- **Alertas de Riesgo**: Notificaciones de posibles amenazas
- **Rastreadores Detectados**: Contador de scripts de rastreo
- **Cookies de Terceros**: Número de cookies de otros dominios
- **Fuga WebRTC**: Si la IP real se expone a través de WebRTC

## Seguridad y Privacidad

Esta aplicación es una herramienta educativa para entender qué información compartes al navegar por internet. 
Recuerda que los sitios web pueden usar esta información para rastrearte y crear perfiles detallados de tus hábitos.

**¡Sé consciente de tu privacidad en línea!**

## Características Modernas

- **Arquitectura modular** - Separación clara de responsabilidades
- **Actualización en tiempo real** - Datos actualizados automáticamente
- **PWA (Progressive Web App)** - Funcionalidad offline
- **Optimizado para Vercel** - Despliegue rápido y sencillo
- **Carga diferida** - Mejor rendimiento
- **Compatibilidad moderna** - Basado en estándares web actuales