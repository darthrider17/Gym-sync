import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { Play, Pause, SkipForward, ThumbsUp, Plus, Music2, Youtube, Disc } from 'lucide-react';
import { Song } from '../types';

const QueuePage: React.FC = () => {
  const { currentSong, queue, isPlaying, playbackPosition, togglePlayPause, voteSong, addSong, removeSong } = useSession();
  const [newSongUrl, setNewSongUrl] = useState('');

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongUrl) return;

    // Simple mock parser for demo
    const platform = newSongUrl.includes('spotify') ? 'spotify' : newSongUrl.includes('youtu') ? 'youtube' : 'local';
    const mockSong: Song = {
      id: Date.now().toString(),
      title: `Song from ${platform}`,
      artist: 'Unknown Artist',
      url: newSongUrl,
      platform,
      duration: '3:00',
      votes: 1,
      addedBy: 'Me'
    };
    addSong(mockSong);
    setNewSongUrl('');
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'spotify': return <Disc className="w-4 h-4 text-green-500" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      default: return <Music2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Player */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        {currentSong ? (
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg border border-slate-700">
              <Music2 className="w-16 h-16 text-slate-600" />
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {getPlatformIcon(currentSong.platform)}
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{currentSong.platform}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1 truncate">{currentSong.title}</h2>
              <p className="text-slate-400 text-lg mb-6">{currentSong.artist}</p>
              
              <div className="flex items-center gap-4 justify-center md:justify-start mb-6">
                <button 
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
                <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-200 transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${(playbackPosition / 180) * 100}%` }} // Mock duration
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-500">
                  <span>{Math.floor(playbackPosition / 60)}:{(playbackPosition % 60).toString().padStart(2, '0')}</span>
                  <span>{currentSong.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <Music2 className="w-12 h-12 mb-4 opacity-50" />
            <p>No song playing. Add songs to queue!</p>
          </div>
        )}
      </div>

      {/* Add Song */}
      <form onSubmit={handleAddSong} className="relative">
        <input
          type="text"
          value={newSongUrl}
          onChange={(e) => setNewSongUrl(e.target.value)}
          placeholder="Paste Spotify or YouTube link..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 pr-12 text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-lg"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Queue List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-white">Up Next</h3>
          <span className="text-xs text-slate-500">{queue.length} songs</span>
        </div>
        
        <div className="divide-y divide-slate-700">
          {queue.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Queue is empty. Be the DJ!
            </div>
          ) : (
            queue.map((song, index) => (
              <div key={song.id} className="p-4 hover:bg-slate-700/50 transition-colors flex items-center gap-4 group">
                <div className="w-8 text-center text-slate-500 font-mono text-sm">{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white truncate">{song.title}</h4>
                    {getPlatformIcon(song.platform)}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{song.artist}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-500">Added by</div>
                    <div className="text-xs text-slate-300">{song.addedBy}</div>
                  </div>
                  <button 
                    onClick={() => voteSong(song.id)}
                    className="flex flex-col items-center min-w-[2rem] text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">{song.votes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QueuePage;