import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { LuckyDrawSection } from './components/LuckyDrawSection';
import { GroupingSection } from './components/GroupingSection';
import { Participant, TabView } from './types';
import { Gift, Users, Edit3, Github } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>('input');

  const renderContent = () => {
    switch (activeTab) {
      case 'input':
        return (
          <InputSection 
            participants={participants} 
            setParticipants={setParticipants} 
            onNext={() => setActiveTab('draw')}
          />
        );
      case 'draw':
        return <LuckyDrawSection participants={participants} />;
      case 'group':
        return <GroupingSection participants={participants} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                L
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                LuckyGroup
              </h1>
            </div>
            <nav className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setActiveTab('input')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'input' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">名單輸入</span>
                <span className="sm:hidden">輸入</span>
              </button>
              <button
                onClick={() => setActiveTab('draw')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'draw' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Gift className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">獎品抽籤</span>
                <span className="sm:hidden">抽籤</span>
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'group' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">自動分組</span>
                <span className="sm:hidden">分組</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 mt-auto bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center text-slate-400 text-sm">
           <p>© {new Date().getFullYear()} LuckyGroup Tool. All rights reserved.</p>
           <div className="flex items-center gap-1">
             Build with <span className="text-red-400">❤</span> using React
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
