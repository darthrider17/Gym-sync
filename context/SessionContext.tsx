import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionState, User, Song, Device } from '../types';

interface SessionContextType extends SessionState {
  joinSession: (roomId: string, username: string) => void;
  createSession: (username: string) => void;
  leaveSession: () => void;
  addSong: (song: Song) => void;
  removeSong: (songId: string) => void;
  voteSong: (songId: string) => void;
  togglePlayPause: () => void;
  updateDevices: (devices: Device[]) => void;
  connectedDevices: Device[];
}

const defaultState: SessionState = {
  roomId: null,
  users: [],
  currentSong: null,
  queue: [],
  isPlaying: false,
  playbackPosition: 0,
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SessionState>(defaultState);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);

  // Mock WebSocket effects
  useEffect(() => {
    let interval: number;
    if (state.isPlaying && state.currentSong) {
      interval = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          playbackPosition: prev.playbackPosition + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isPlaying, state.currentSong]);

  const createSession = (username: string) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user: User = { id: 'host-1', name: username, isHost: true };
    setState({
      ...defaultState,
      roomId,
      users: [user],
      // Mock initial data
      queue: [
        {
          id: '1',
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          url: 'https://spotify.com/track/123',
          platform: 'spotify',
          duration: '3:20',
          votes: 5,
          addedBy: 'System'
        },
        {
          id: '2',
          title: 'Lo-Fi Beats to Study To',
          artist: 'Chill Cow',
          url: 'https://youtube.com/watch?v=5qap5aO4i9A',
          platform: 'youtube',
          duration: '24:00',
          votes: 2,
          addedBy: 'System'
        }
      ]
    });
  };

  const joinSession = (roomId: string, username: string) => {
    const user: User = { id: `user-${Date.now()}`, name: username, isHost: false };
    // In a real app, this would fetch state from server
    setState(prev => ({
      ...prev,
      roomId,
      users: [...prev.users, user]
    }));
  };

  const leaveSession = () => {
    setState(defaultState);
  };

  const addSong = (song: Song) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, song]
    }));
  };

  const removeSong = (songId: string) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter(s => s.id !== songId)
    }));
  };

  const voteSong = (songId: string) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.map(s => s.id === songId ? { ...s, votes: s.votes + 1 } : s).sort((a, b) => b.votes - a.votes)
    }));
  };

  const togglePlayPause = () => {
    setState(prev => {
      // If no song is playing, play the first one in queue
      if (!prev.currentSong && prev.queue.length > 0) {
        const [next, ...rest] = prev.queue;
        return {
          ...prev,
          isPlaying: true,
          currentSong: next,
          queue: rest
        };
      }
      return {
        ...prev,
        isPlaying: !prev.isPlaying
      };
    });
  };

  const updateDevices = (devices: Device[]) => {
    setConnectedDevices(devices);
  };

  return (
    <SessionContext.Provider value={{
      ...state,
      connectedDevices,
      createSession,
      joinSession,
      leaveSession,
      addSong,
      removeSong,
      voteSong,
      togglePlayPause,
      updateDevices
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};