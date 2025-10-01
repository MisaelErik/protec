// Importar todos los módulos necesarios
import { NetworkService } from './services/NetworkService.js';
import { DeviceService } from './services/DeviceService.js';
import { PrivacyService } from './services/PrivacyService.js';
import { SecurityService } from './services/SecurityService.js';
import { UIService } from './services/UIService.js';

export default class App {
  static async init() {
    console.log('Iniciando Panel de Control de Privacidad con Vite');
    
    // Inicializar servicios
    await NetworkService.init();
    DeviceService.init();
    PrivacyService.init();
    SecurityService.init();
    UIService.init();
    
    // Actualizar toda la interfaz
    this.updateAll();
    
    // Configurar actualizaciones periódicas
    this.setupPeriodicUpdates();
  }

  static updateAll() {
    // Actualizar todos los componentes
    NetworkService.updateNetworkInfo();
    DeviceService.updateDeviceInfo();
    PrivacyService.updatePrivacyInfo();
    SecurityService.updateSecurityInfo();
    UIService.updateUI();
  }

  static setupPeriodicUpdates() {
    // Actualizar reloj cada segundo
    setInterval(() => {
      DeviceService.updateClock();
    }, 1000);

    // Actualizar velocidad de conexión cada 30 segundos
    setInterval(() => {
      NetworkService.measureSpeed();
    }, 30000);

    // Actualizar ubicación cada 5 minutos
    setInterval(() => {
      NetworkService.fetchIPAndLocation();
    }, 300000);
  }
}