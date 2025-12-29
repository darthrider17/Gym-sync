export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  platform: 'spotify' | 'youtube' | 'apple' | 'local';
  duration: string;
  votes: number;
  addedBy: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'host' | 'client' | 'speaker';
  status: 'connected' | 'disconnected' | 'connecting';
  latency: number; // in ms
  batteryLevel?: number;
}

export interface User {
  id: string;
  name: string;
  isHost: boolean;
}

export interface SessionState {
  roomId: string | null;
  users: User[];
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  playbackPosition: number; // seconds
}

export enum ConnectionStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}