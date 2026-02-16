
import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import CameraStream from './components/CameraStream';
import Dashboard from './components/Dashboard';
import MusicPlayer from './components/MusicPlayer';
import Games from './components/Games';
import Chatbot from './components/Chatbot';
import { Emotion, User, MoodEntry, CareerAdvice } from './types';
import { getCareerGuidance } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [activeTab, setActiveTab] = useState('home');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(Emotion.NEUTRAL);
  const [careerAdvice, setCareerAdvice] = useState<CareerAdvice | null>(null);
  
  // Settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');

  // Auth Inputs
  const [authData, setAuthData] = useState({ username: '', password: '', fullName: '', email: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('emotiguide_user');
    const savedHistory = localStorage.getItem('emotiguide_history');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHistory) setMoodHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real project, this would be a database call
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      username: authData.username || 'Student101',
      fullName: authData.fullName || 'Guest Student',
      email: authData.email || 'guest@example.com',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('emotiguide_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('emotiguide_user');
  };

  const onEmotionDetected = useCallback((emotion: Emotion, confidence: number) => {
    setCurrentEmotion(emotion);
    const newEntry: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'anon',
      emotion,
      confidence,
      timestamp: Date.now()
    };
    setMoodHistory(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem('emotiguide_history', JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const fetchCareerAdvice = async () => {
    const advice = await getCareerGuidance(currentEmotion, 'BCA Student');
    setCareerAdvice(advice);
    setActiveTab('career');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center text-white">
            <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <i className="fa-solid fa-robot text-4xl"></i>
            </div>
            <h1 className="text-3xl font-bold mb-2">EmotiGuide</h1>
            <p className="text-blue-100 text-sm">Your AI Mood & Career Companion</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                    placeholder="Akash Thakur"
                    value={authData.fullName}
                    onChange={(e) => setAuthData({...authData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                    placeholder="akash@example.com"
                    value={authData.email}
                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                placeholder="akash_064"
                value={authData.username}
                onChange={(e) => setAuthData({...authData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                placeholder="••••••••"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
              />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 mt-4">
              {isLogin ? 'Sign In' : 'Register Now'}
            </button>
            
            <p className="text-center text-sm text-slate-500 mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Live Emotion Analysis</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setVoiceEnabled(!voiceEnabled)} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${voiceEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <i className={`fa-solid ${voiceEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
                    </button>
                    <select 
                      value={voiceGender} 
                      onChange={(e) => setVoiceGender(e.target.value as any)}
                      className="text-xs font-bold bg-slate-100 border-none rounded-lg px-2 py-1 outline-none"
                    >
                      <option value="female">AI Female</option>
                      <option value="male">AI Male</option>
                    </select>
                  </div>
                </div>
                <CameraStream 
                  onEmotionDetected={onEmotionDetected} 
                  voiceEnabled={voiceEnabled}
                  voiceGender={voiceGender}
                />
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: 'music', label: 'Play Music', icon: 'fa-music', color: 'bg-blue-100 text-blue-600' },
                    { id: 'games', label: 'Relieve Stress', icon: 'fa-gamepad', color: 'bg-indigo-100 text-indigo-600' },
                    { id: 'career', label: 'Career Guide', icon: 'fa-user-tie', color: 'bg-emerald-100 text-emerald-600', action: fetchCareerAdvice },
                    { id: 'chat', label: 'AI Support', icon: 'fa-heart', color: 'bg-rose-100 text-rose-600' },
                  ].map((btn) => (
                    <button 
                      key={btn.id}
                      onClick={() => btn.action ? btn.action() : setActiveTab(btn.id)}
                      className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${btn.color}`}>
                        <i className={`fa-solid ${btn.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Feeling {currentEmotion}?</h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Based on your current emotional state, our AI suggests taking a moment for your mental well-being.
                  </p>
                  <button 
                    onClick={fetchCareerAdvice}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform"
                  >
                    View Recommendations
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-slate-400"></i> Recent History
                </h3>
                <div className="space-y-3">
                  {moodHistory.slice(-4).reverse().map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm text-sm">
                          {entry.emotion === Emotion.HAPPY ? '😊' : entry.emotion === Emotion.SAD ? '😢' : entry.emotion === Emotion.ANGRY ? '😠' : '😐'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{entry.emotion}</p>
                          <p className="text-[10px] text-slate-400">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{(entry.confidence * 100).toFixed(0)}% Match</span>
                    </div>
                  ))}
                  {moodHistory.length === 0 && <p className="text-center text-xs text-slate-400 py-4 italic">No mood detected yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard entries={moodHistory} />}

        {activeTab === 'career' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">AI Career Companion</h2>
              <p className="text-slate-500 mb-10">Personalized guidance based on your emotional intelligence and academic background.</p>
              
              {careerAdvice ? (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                      <i className="fa-solid fa-rocket"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{careerAdvice.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{careerAdvice.description}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-list-check text-blue-500"></i> Actionable Roadmap
                    </h4>
                    <ul className="space-y-3">
                      {careerAdvice.steps.map((step, i) => (
                        <li key={i} className="flex gap-4 items-center">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                          <span className="text-sm text-slate-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button onClick={fetchCareerAdvice} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Regenerate</button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-colors">Download PDF</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                     <i className="fa-solid fa-robot text-blue-600 text-2xl animate-bounce"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Ready to plan your future?</h3>
                  <p className="text-sm text-slate-400 mb-6">Let the AI analyze your current mood and major to provide the best career roadmap.</p>
                  <button 
                    onClick={fetchCareerAdvice}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Generate Career Roadmap
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'music' && <MusicPlayer currentEmotion={currentEmotion} />}

        {activeTab === 'games' && <Games />}

        {activeTab === 'chat' && (
          <div className="max-w-2xl mx-auto">
            <Chatbot />
          </div>
        )}
      </main>

      {/* Floating Action Button for AI Chat on other tabs */}
      {activeTab !== 'chat' && (
        <button 
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all z-50 group"
        >
          <i className="fa-solid fa-message"></i>
          <span className="absolute right-16 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-indigo-100">Talk to AI Friend</span>
        </button>
      )}
    </div>
  );
};

export default App;
