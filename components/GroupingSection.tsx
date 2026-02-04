import React, { useState } from 'react';
import { Users, Shuffle, Download, Layers } from 'lucide-react';
import { Participant, GroupResult } from '../types';
import { shuffleArray, exportToCSV } from '../utils';

interface GroupingSectionProps {
  participants: Participant[];
}

export const GroupingSection: React.FC<GroupingSectionProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<GroupResult[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const generateGroups = () => {
    if (participants.length === 0) return;
    if (groupSize <= 0) {
      alert("每組人數必須大於 0");
      return;
    }

    const shuffled = shuffleArray<Participant>(participants);
    const newGroups: GroupResult[] = [];
    let groupId = 1;

    for (let i = 0; i < shuffled.length; i += groupSize) {
      const chunk = shuffled.slice(i, i + groupSize);
      newGroups.push({
        groupId: groupId++,
        members: chunk
      });
    }

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const handleExport = () => {
    if (groups.length === 0) return;
    
    // Convert to rows: Group ID, Member 1, Member 2...
    const maxMembers = Math.max(...groups.map(g => g.members.length));
    const header = ['組別', ...Array.from({ length: maxMembers }, (_, i) => `成員 ${i + 1}`)];
    
    const rows = groups.map(g => {
        const memberNames = g.members.map(m => m.name);
        // Pad with empty strings if group is smaller than max
        const paddedMembers = [...memberNames, ...Array(maxMembers - memberNames.length).fill('')];
        return [`第 ${g.groupId} 組`, ...paddedMembers];
    });

    exportToCSV('分組結果.csv', header, rows);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1 space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                每組人數設定
             </label>
             <div className="flex items-center gap-4">
               <input
                 type="number"
                 min="1"
                 max={participants.length || 1}
                 value={groupSize}
                 onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                 className="block w-full max-w-[200px] rounded-lg border-slate-300 bg-white text-slate-900 border p-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
               />
               <span className="text-slate-500 text-sm">
                 (總人數: {participants.length} 人，預計分 {Math.ceil(participants.length / (groupSize || 1))} 組)
               </span>
             </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={generateGroups}
              disabled={participants.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              自動分組
            </button>
            
            {isGenerated && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                匯出 CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {isGenerated && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div key={group.groupId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  第 {group.groupId} 組
                </h3>
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {group.members.map((member) => (
                    <li key={member.id} className="flex items-center gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      {member.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isGenerated && participants.length > 0 && (
         <div className="text-center py-20 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Shuffle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>設定人數並點擊「自動分組」開始</p>
         </div>
      )}
    </div>
  );
};