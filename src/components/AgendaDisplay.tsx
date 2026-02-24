import React, { useState } from 'react';
import { Clock, Users, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { MeetingAgenda } from '../types';
import { cn } from '../utils';

interface AgendaDisplayProps {
  agenda: MeetingAgenda;
  totalDuration: number;
  onDurationChange: (val: number) => void;
}

export const AgendaDisplay: React.FC<AgendaDisplayProps> = ({ agenda, totalDuration, onDurationChange }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `Meeting Agenda: ${agenda.title}\n\n` + 
      agenda.items.map((item, idx) => {
        const duration = Math.round((item.suggestedPercentage / 100) * totalDuration);
        return `${idx + 1}. ${item.title} (${duration}m)\n` +
          `Summary: ${item.summary}\n` +
          `Action Items: ${item.actionItems.join(', ')}\n` +
          `Stakeholders: ${item.stakeholders.join(', ')}\n`;
      }).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{agenda.title}</h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Generated meeting structure based on your document
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard}
            className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-600 hover:text-indigo-600 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
          </button>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Meeting Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={totalDuration}
                  onChange={(e) => onDurationChange(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-20 text-2xl font-bold text-indigo-600 focus:outline-none"
                />
                <span className="text-slate-400 font-medium">minutes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        {agenda.items.map((item, index) => {
          const duration = Math.round((item.suggestedPercentage / 100) * totalDuration);
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Duration</div>
                      <div className="text-lg font-bold text-indigo-600">{duration}m</div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase">{item.suggestedPercentage}% of total</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Action Items
                    </div>
                    <ul className="space-y-2">
                      {item.actionItems.map((ai, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <ChevronRight className="w-3 h-3 mt-1 text-slate-300 shrink-0" />
                          {ai}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                      <Users className="w-4 h-4 text-indigo-500" />
                      Stakeholders
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.stakeholders.map((sh, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                          {sh}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
