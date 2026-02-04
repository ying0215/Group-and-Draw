import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, UserPlus, Trash2, AlertCircle, Copy, Sparkles, Filter } from 'lucide-react';
import { Participant } from '../types';
import { parseNames } from '../utils';

interface InputSectionProps {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
  onNext: () => void;
}

const TEST_NAMES = `王小明, 李華, 陳大文, 張偉, 林美玲, 
陳志明, 林志玲, 黃春梅, 張志強, 李小龍, 
周杰倫, 蔡依林, 五月天, 鄧紫棋, 陳奕迅, 
林俊傑, 謝金燕, 伍佰, 田馥甄, 蕭敬騰`;

export const InputSection: React.FC<InputSectionProps> = ({ participants, setParticipants, onNext }) => {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect duplicates
  const nameCounts = useMemo(() => {
    return participants.reduce((acc, p) => {
      acc[p.name] = (acc[p.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [participants]);

  const hasDuplicates = Object.values(nameCounts).some((count) => (count as number) > 1);

  const handleTextAdd = () => {
    if (!textInput.trim()) return;
    const newParticipants = parseNames(textInput);
    setParticipants([...participants, ...newParticipants]);
    setTextInput('');
    setError(null);
  };

  const handleFillTestValues = () => {
    setTextInput(TEST_NAMES);
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList: Participant[] = [];
    
    participants.forEach(p => {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        uniqueList.push(p);
      }
    });

    setParticipants(uniqueList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('請上傳 .csv 格式的檔案');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const newParticipants = parseNames(text);
        setParticipants([...participants, ...newParticipants]);
        setError(null);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
      setTextInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-indigo-600" />
          輸入名單來源
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-600">直接貼上姓名</label>
              <button 
                onClick={handleFillTestValues}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                填入測試名單
              </button>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-40 p-3 rounded-xl border border-slate-300 bg-white text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none placeholder-slate-400"
              placeholder="例如：&#10;王小明&#10;李大華&#10;張三"
            ></textarea>
            <button
              onClick={handleTextAdd}
              disabled={!textInput.trim()}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              加入名單
            </button>
          </div>

          {/* CSV Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-600">或是上傳 CSV 檔案</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-slate-300 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <FileText className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
              <span className="text-slate-500 group-hover:text-indigo-600 text-sm">點擊上傳 CSV</span>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List Preview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            目前的參與者 ({participants.length} 人)
          </h2>
          <div className="flex items-center gap-2">
            {hasDuplicates && (
              <button
                onClick={handleRemoveDuplicates}
                className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <Filter className="w-4 h-4" />
                一鍵去重
              </button>
            )}
            {participants.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                清空名單
              </button>
            )}
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            目前還沒有名單，請由上方新增
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-2">
            {participants.map((p) => {
              const isDuplicate = nameCounts[p.name] > 1;
              return (
                <div 
                  key={p.id} 
                  className={`px-3 py-2 rounded-lg text-center text-sm truncate border transition-colors ${
                    isDuplicate 
                      ? 'bg-red-50 text-red-700 border-red-200 font-medium' 
                      : 'bg-slate-100 text-slate-900 border-slate-200'
                  }`}
                  title={isDuplicate ? '此為重複姓名' : p.name}
                >
                  {p.name}
                  {isDuplicate && <span className="ml-1 text-xs text-red-500">!</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {participants.length > 0 && (
        <div className="flex justify-center pt-4">
           <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
           >
             開始使用功能
           </button>
        </div>
      )}
    </div>
  );
};