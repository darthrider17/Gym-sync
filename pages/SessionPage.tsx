import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { Copy, LogOut, Play, UserPlus, Users } from 'lucide-react';

const SessionPage: React.FC = () => {
  const { roomId, users, createSession, joinSession, leaveSession } = useSession();
  const [username, setUsername] = useState('');
  const [joinId, setJoinId] = useState('');

  if (roomId) {
    return (
      <div className="space-y-6">
        {/* Active Session Header */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Session Active</h2>
              <p className="text-slate-400">Manage your collaborative listening party</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 text-sm uppercase tracking-wider">Room Code:</span>
              <span className="text-xl font-mono text-indigo-400 font-bold tracking-widest">{roomId}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(roomId)}
                className="text-slate-500 hover:text-white transition-colors"
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Connected Users
              </h3>
              <span className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded text-xs font-medium">
                {users.length} Active
              </span>
            </div>
            <ul className="space-y-3">
              {users.map(user => (
                <li key={user.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </div>
                  {user.isHost && (
                    <span className="text-xs bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded border border-yellow-900/50">
                      HOST
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/20 flex flex-col justify-center items-center text-center space-y-4">
            <div className="p-4 bg-indigo-500/10 rounded-full">
              <UserPlus className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Invite Friends</h3>
              <p className="text-slate-400 text-sm mt-1">Share the room code or QR code to let others join the queue.</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
              Show QR Code
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={leaveSession}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Leave Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Gym Sync
        </h1>
        <p className="text-slate-400">Join a room or create a new session to start listening together.</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => username && createSession(username)}
              disabled={!username}
              className="flex flex-col items-center justify-center p-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
            >
              <Play className="w-6 h-6 mb-2" />
              <span className="font-medium">Create Room</span>
            </button>
            <div className="space-y-2">
              <input
                type="text"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-sm font-mono uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={() => username && joinId && joinSession(joinId, username)}
                disabled={!username || !joinId}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;