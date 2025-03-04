// pages/index.tsx
"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Volume2, VolumeX, CloudRain, Trees, Waves, Flame, Bird, 
  Moon, Droplets, Music, Sliders, Sun
} from 'lucide-react';

interface SoundItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  audioSrc: string;
  color: string;
}

interface ActiveSound {
  id: string;
  audio: HTMLAudioElement;
  volume: number;
}

const soundsList: SoundItem[] = [
  { 
    id: 'rain', 
    name: 'ฝนตก', 
    icon: <CloudRain size={28} />, 
    audioSrc: '/sounds/rain.wav',
    color: 'from-blue-400 to-blue-600' 
  },
  { 
    id: 'forest', 
    name: 'ป่าไม้', 
    icon: <Trees size={28} />, 
    audioSrc: '/sounds/forest.wav',
    color: 'from-green-400 to-green-600' 
  },
  { 
    id: 'waves', 
    name: 'คลื่นทะเล', 
    icon: <Waves size={28} />, 
    audioSrc: '/sounds/waves.wav',
    color: 'from-cyan-400 to-cyan-600' 
  },
  { 
    id: 'fire', 
    name: 'เสียงไฟ', 
    icon: <Flame size={28} />, 
    audioSrc: '/sounds/fire.wav',
    color: 'from-orange-400 to-orange-600' 
  },
  { 
    id: 'birds', 
    name: 'นกร้อง', 
    icon: <Bird size={28} />, 
    audioSrc: '/sounds/birds.wav',
    color: 'from-yellow-400 to-yellow-600' 
  },
  { 
    id: 'night', 
    name: 'เสียงกลางคืน', 
    icon: <Moon size={28} />, 
    audioSrc: '/sounds/night.wav',
    color: 'from-indigo-400 to-indigo-600' 
  },
  { 
    id: 'stream', 
    name: 'ลำธาร', 
    icon: <Droplets size={28} />, 
    audioSrc: '/sounds/stream.wav',
    color: 'from-sky-400 to-sky-600' 
  },
  { 
    id: 'meditation', 
    name: 'เพลงสมาธิ', 
    icon: <Music size={28} />, 
    audioSrc: '/sounds/meditation.wav',
    color: 'from-purple-400 to-purple-600' 
  },
];

export default function Home() {
  const [activeSounds, setActiveSounds] = useState<Map<string, ActiveSound>>(new Map());
  const [masterVolume, setMasterVolume] = useState(80);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isVolumeSettingsOpen, setVolumeSettingsOpen] = useState(false);
  
  const toggleSound = (soundId: string) => {
    const newActiveSounds = new Map(activeSounds);
    
    if (newActiveSounds.has(soundId)) {
      // เมื่อกดซ้ำ ให้ลบเสียงนั้นออกจากการเล่น
      const sound = newActiveSounds.get(soundId);
      if (sound) {
        sound.audio.pause();
        sound.audio.currentTime = 0;
      }
      newActiveSounds.delete(soundId);
    } else {
      // เมื่อกดเพิ่มใหม่ ให้เพิ่มเสียงเข้าไปในการเล่น
      const soundItem = soundsList.find(s => s.id === soundId);
      if (soundItem) {
        const audio = new Audio(soundItem.audioSrc);
        audio.loop = true;
        audio.volume = masterVolume / 100;
        audio.play().catch(e => console.error("Error playing audio:", e));
        
        newActiveSounds.set(soundId, {
          id: soundId,
          audio: audio,
          volume: masterVolume
        });
      }
    }
    
    setActiveSounds(newActiveSounds);
  };

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setMasterVolume(newVolume);
    
    // ปรับระดับเสียงทั้งหมด
    activeSounds.forEach(sound => {
      sound.audio.volume = newVolume / 100;
    });
  };
  
  const toggleMute = () => {
    if (masterVolume > 0) {
      // บันทึกค่าระดับเสียงปัจจุบันไว้ก่อนที่จะปิดเสียง
      setMasterVolume(0);
      
      activeSounds.forEach(sound => {
        sound.audio.volume = 0;
      });
    } else {
      // กลับไปเป็น 80% หรือค่าที่เคยตั้งไว้ก่อนหน้า
      setMasterVolume(80);
      
      activeSounds.forEach(sound => {
        sound.audio.volume = 80 / 100;
      });
    }
  };
  
  const adjustSoundVolume = (soundId: string, newVolume: number) => {
    const newActiveSounds = new Map(activeSounds);
    const sound = newActiveSounds.get(soundId);
    
    if (sound) {
      sound.audio.volume = (newVolume / 100) * (masterVolume / 100);
      sound.volume = newVolume;
      newActiveSounds.set(soundId, sound);
      setActiveSounds(newActiveSounds);
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // ทำความสะอาด audio elements เมื่อ component unmount
  useEffect(() => {
    return () => {
      activeSounds.forEach(sound => {
        sound.audio.pause();
        sound.audio.src = '';
      });
    };
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-indigo-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800'
    }`}>
      <Head>
        <title>เสียงผ่อนคลาย | ฟังเสียงธรรมชาติ</title>
        <meta name="description" content="เว็บไซต์สำหรับฟังเสียงธรรมชาติเพื่อการผ่อนคลาย" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            เสียงผ่อนคลาย
          </h1>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-100 shadow-md'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setVolumeSettingsOpen(!isVolumeSettingsOpen)}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-100 shadow-md'
                }`}
              >
                <Sliders size={20} />
              </button>
              
              {isVolumeSettingsOpen && (
                <div className={`absolute right-0 mt-2 p-4 rounded-lg shadow-lg z-10 w-64 ${
                  theme === 'dark' 
                    ? 'bg-gray-800' 
                    : 'bg-white'
                }`}>
                  <h3 className="font-medium mb-2">ปรับระดับเสียงแต่ละประเภท</h3>
                  
                  {Array.from(activeSounds.keys()).map(soundId => {
                    const sound = activeSounds.get(soundId);
                    const soundItem = soundsList.find(s => s.id === soundId);
                    
                    return (
                      <div key={soundId} className="flex items-center mb-2">
                        <div className="w-8 flex-shrink-0">
                          {soundItem?.icon}
                        </div>
                        <div className="ml-2 flex-grow">
                          <p className="text-sm">{soundItem?.name}</p>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sound?.volume || 100}
                            onChange={(e) => adjustSoundVolume(soundId, parseInt(e.target.value))}
                            className="w-full h-2 accent-purple-500 mt-1"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mb-8">
          {/* ส่วนแสดงไอคอนเสียงต่างๆ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {soundsList.map((sound) => {
              const isActive = activeSounds.has(sound.id);
              
              return (
                <button
                  key={sound.id}
                  onClick={() => toggleSound(sound.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 ${
                    theme === 'dark'
                      ? isActive 
                        ? `bg-gradient-to-br ${sound.color} shadow-lg shadow-${sound.color.split('-')[1]}/20 scale-105` 
                        : 'bg-gray-800 hover:bg-gray-700'
                      : isActive 
                        ? `bg-gradient-to-br ${sound.color} shadow-lg shadow-${sound.color.split('-')[1]}/20 scale-105` 
                        : 'bg-white hover:bg-gray-100 shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {sound.icon}
                  </div>
                  <span className={`text-sm font-medium ${isActive && 'text-white'}`}>
                    {sound.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* บอกว่ากำลังเลือกอันไหนอยู่ */}
        {activeSounds.size > 0 && (
          <div className={`max-w-4xl mx-auto p-4 rounded-xl mb-6 ${
            theme === 'dark' 
              ? 'bg-gray-800/70 backdrop-blur' 
              : 'bg-white/70 backdrop-blur shadow-md'
          }`}>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm mr-2">กำลังเล่น:</span>
              {Array.from(activeSounds.keys()).map(soundId => {
                const soundItem = soundsList.find(s => s.id === soundId);
                return (
                  <span 
                    key={soundId} 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                      theme === 'dark'
                        ? `bg-gradient-to-r ${soundItem?.color} text-white`
                        : `bg-gradient-to-r ${soundItem?.color} text-white`
                    }`}
                  >
                    {soundItem?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* ส่วนควบคุมเสียง */}
        <div className={`max-w-4xl mx-auto ${
          theme === 'dark' 
            ? 'bg-gray-800/70 backdrop-blur' 
            : 'bg-white/70 backdrop-blur shadow-md'
        } rounded-xl p-4 transition-opacity duration-300 ${
          activeSounds.size > 0 ? 'opacity-100' : 'opacity-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute} 
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
                disabled={activeSounds.size === 0}
              >
                {masterVolume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              
              <span className="text-sm w-8">{masterVolume}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={handleMasterVolumeChange}
              className="w-full max-w-md mx-4 h-2 accent-purple-500"
              disabled={activeSounds.size === 0}
            />
            
            <div className="text-sm">
              {activeSounds.size > 0 
                ? `${activeSounds.size} เสียงที่กำลังเล่น` 
                : 'เลือกเสียงที่ต้องการฟัง'
              }
            </div>
          </div>
        </div>
      </main>

      <footer className={`text-center py-6 ${
        theme === 'dark' 
          ? 'text-gray-400' 
          : 'text-gray-600'
      } text-sm`}>
        <p>สร้างด้วย ❤️ เพื่อการผ่อนคลาย และการนอนหลับที่ดี</p>
      </footer>
    </div>
  );
}