import { Device } from '../types';

// NOTE: Web Bluetooth API is limited in browsers.
// It mostly allows connecting to GATT servers (Low Energy).
// For Classic Bluetooth (A2DP Audio), browsers don't have direct API access for streaming.
// We simulate the "Manager" aspect here or use GATT for controls if supported.

export const scanForDevices = async (): Promise<Device> => {
  try {
    // In a real scenario, we would filter for specific services
    // const device = await navigator.bluetooth.requestDevice({
    //   acceptAllDevices: true,
    //   optionalServices: ['battery_service'] // Example service
    // });
    
    // Simulating a delay and a mock device for the UI demo because 
    // Web Bluetooth requires a secure context and user gesture, 
    // and might fail in some iframe environments.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockId = Math.random().toString(36).substring(7);
    return {
      id: mockId,
      name: `Bluetooth Speaker ${mockId.toUpperCase()}`,
      type: 'speaker',
      status: 'connected',
      latency: Math.floor(Math.random() * 200) + 20, // 20-220ms simulated latency
      batteryLevel: Math.floor(Math.random() * 100)
    };
  } catch (error) {
    console.error("Bluetooth scan failed", error);
    throw error;
  }
};

export const disconnectDevice = async (device: Device): Promise<void> => {
  // Real implementation would call device.gatt.disconnect()
  await new Promise(resolve => setTimeout(resolve, 500));
};