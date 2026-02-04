import React, { useState, useEffect, useRef } from 'react';
import { Gift, Play, RotateCcw, Download, Settings } from 'lucide-react';
import { Participant } from '../types';
import { exportToCSV } from '../utils';

interface LuckyDrawSectionProps {
  participants: Participant[];
}

export const LuckyDrawSection: React.FC<LuckyDrawSectionProps> = ({ participants }) => {
  const [winners, setWinners] = useState<Participant[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<string>('準備抽獎');
  const [isDrawing, setIsDrawing] = useState(false);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [candidateList, setCandidateList] = useState<Participant[]>([]);

  // Animation refs
  const intervalRef = useRef<number | null>(null);

  // Initialize candidates
  useEffect(() => {
    setCandidateList(participants);
  }, [participants]);

  // Handle pool updates based on repeat settings
  useEffect(() => {
    if (allowRepeats) {
      setCandidateList(participants);
    } else {
      // Filter out existing winners
      const winnerIds = new Set(winners.map(w => w.id));
      setCandidateList(participants.filter(p => !winnerIds.has(p.id)));
    }
  }, [allowRepeats, participants, winners]);

  const startDraw = () => {
    if (candidateList.length === 0) {
      alert('沒有足夠的參與者可以抽取！');
      return;
    }

    setIsDrawing(true);

    // Fast cycling animation
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * candidateList.length);
      setCurrentDisplay(candidateList[randomIndex].name);
    }, 50);

    // Stop after random time (2-3 seconds)
    const duration = 2000 + Math.random() * 1000;

    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Select final winner
      const finalIndex = Math.floor(Math.random() * candidateList.length);
      const winner = candidateList[finalIndex];
      setCurrentDisplay(winner.name);
      setWinners(prev => [winner, ...prev]);
      setIsDrawing(false);

      // Trigger simple confetti effect (CSS based or simple visual cue)
      // Since we don't have the library installed, we rely on UI state
    }, duration);
  };

  const resetDraw = () => {
    if (confirm('確定要清除所有中獎名單嗎？')) {
      setWinners([]);
      setCurrentDisplay('準備抽獎');
    }
  };

  const handleExport = () => {
    if (winners.length === 0) return;
    const rows = winners.map((w, index) => [`${winners.length - index}`, w.name]);
    exportToCSV('抽獎結果.csv', ['順序', '中獎者'], rows);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Controls & History */}
        <div className="md:col-span-1 space-y-6">
          {/* Settings */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-indigo-600" />
              抽獎設定
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600 text-sm">允許重複中獎</span>
              <button
                onClick={() => setAllowRepeats(!allowRepeats)}
                className={`w-12 h-6 rounded-full transition-colors relative ${allowRepeats ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${allowRepeats ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              候選池剩餘人數: <span className="font-bold text-indigo-600 text-base">{candidateList.length}</span>
            </div>
          </div>

          {/* Winner List */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 max-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                中獎名單 ({winners.length})
              </h3>
              {winners.length > 0 && (
                <button onClick={handleExport} className="text-indigo-600 hover:text-indigo-800" title="匯出CSV">
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
              {winners.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-4">尚未抽出任何人</div>
              )}
              {winners.map((winner, idx) => (
                <div key={idx} className="flex justify-between items-center bg-pink-50 text-pink-900 px-3 py-2 rounded-lg border border-pink-100 animate-slide-in">
                  <span className="font-medium text-sm">#{winners.length - idx}</span>
                  <span className="font-bold">{winner.name}</span>
                </div>
              ))}
            </div>
            {winners.length > 0 && (
              <button
                onClick={resetDraw}
                className="mt-4 w-full py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-colors flex justify-center items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" /> 重置抽獎
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Main Display */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="text-center w-full z-10">
              <h2 className="text-slate-400 font-medium mb-6 tracking-widest uppercase">Lucky Winner</h2>
              <div className={`text-5xl md:text-7xl font-black text-slate-800 break-words transition-all duration-100 ${isDrawing ? 'scale-110 opacity-80 blur-[1px]' : 'scale-100'}`}>
                {currentDisplay}
              </div>
            </div>

            <div className="mt-12 w-full max-w-xs z-10">
              <button
                onClick={startDraw}
                disabled={isDrawing || candidateList.length === 0}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isDrawing ? (
                  '抽取中...'
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    開始抽獎
                  </>
                )}
              </button>
            </div>

            {/* Visual Flair */}
            {!isDrawing && winners.length > 0 && winners[0].name === currentDisplay && (
              <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-10">
                <Gift className="w-64 h-64" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
