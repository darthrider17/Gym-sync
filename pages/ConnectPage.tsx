import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { scanForDevices } from '../services/bluetooth';
import { Bluetooth, Speaker, Smartphone, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Device } from '../types';

const ConnectPage: React.FC = () => {
  const { connectedDevices, updateDevices } = useSession();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const device = await scanForDevices();
      // Check if already connected
      if (!connectedDevices.find(d => d.id === device.id)) {
        updateDevices([...connectedDevices, device]);
      }
    } catch (err) {
      setError("Failed to connect. Make sure Bluetooth is enabled and the device is in pairing mode.");
    } finally {
      setIsScanning(false);
    }
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch(type) {
      case 'speaker': return <Speaker className="w-6 h-6" />;
      case 'host': return <Smartphone className="w-6 h-6" />;
      default: return <Bluetooth className="w-6 h-6" />;
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-400';
    if (latency < 150) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Device Management</h2>
          <p className="text-slate-400">Manage connected Bluetooth audio devices and latency.</p>
        </div>
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/20"
        >
          {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bluetooth className="w-5 h-5" />}
          {isScanning ? 'Scanning...' : 'Connect Device'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          {error}
        </div>
      )}

      {/* Main Host Device */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Primary Host</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">This Browser</h4>
            <p className="text-sm text-slate-400">Master Controller</p>
          </div>
          <div className="ml-auto">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/20">
               Active
             </span>
          </div>
        </div>
      </div>

      {/* Connected Devices List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Connected Audio Devices</h3>
        
        {connectedDevices.length === 0 ? (
          <div className="text-center p-12 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 text-slate-500">
            <Speaker className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No Bluetooth devices connected.</p>
            <p className="text-sm mt-1">Click "Connect Device" to pair a speaker.</p>
          </div>
        ) : (
          connectedDevices.map(device => (
            <div key={device.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-4 transition-all hover:border-slate-600">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300">
                {getDeviceIcon(device.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{device.name}</h4>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className={`flex items-center gap-1 ${getLatencyColor(device.latency)}`}>
                    <RefreshCw className="w-3 h-3" />
                    {device.latency}ms latency
                  </span>
                  {device.batteryLevel && (
                    <span className="text-slate-400">
                      Battery: {device.batteryLevel}%
                    </span>
                  )}
                </div>
              </div>

              <button className="text-slate-400 hover:text-red-400 p-2 transition-colors">
                Disconnect
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-900/50 rounded-lg p-4 text-xs text-slate-500 leading-relaxed">
        <strong>Note:</strong> Browsers restrict direct audio stream routing via Web Bluetooth. 
        This dashboard manages device metadata and soft-sync offsets. 
        Actual audio output must be selected in your OS settings or using the Chrome Extension helper.
      </div>
    </div>
  );
};

export default ConnectPage;