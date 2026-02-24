import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUploader } from './components/FileUploader';
import { AgendaDisplay } from './components/AgendaDisplay';
import { generateAgendaFromText } from './services/gemini';
import { MeetingAgenda } from './types';
import { Sparkles, RefreshCcw } from 'lucide-react';

export default function App() {
  const [agenda, setAgenda] = useState<MeetingAgenda | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalDuration, setTotalDuration] = useState(60);

  const handleFileProcessed = async (text: string) => {
    setIsProcessing(true);
    try {
      const result = await generateAgendaFromText(text);
      setAgenda({
        ...result,
        items: result.items.map((item, idx) => ({
          ...item,
          id: `item-${idx}-${Date.now()}`
        })),
        totalDuration: 60
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate agenda. Please check your document and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setAgenda(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-50/40 blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {!agenda ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-indigo-600 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Meeting Crafting
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                  Turn documents into <span className="text-indigo-600">agendas.</span>
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Upload your meeting notes, project docs, or brainstorms. 
                  We'll extract topics, assign stakeholders, and calculate the perfect timing.
                </p>
              </div>

              <FileUploader onFileProcessed={handleFileProcessed} isProcessing={isProcessing} />
            </motion.div>
          ) : (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex justify-center">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all text-sm font-medium shadow-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Start New Agenda
                </button>
              </div>
              
              <AgendaDisplay 
                agenda={agenda} 
                totalDuration={totalDuration}
                onDurationChange={setTotalDuration}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} AgendaCraft • Powered by Gemini AI</p>
      </footer>
    </div>
  );
}
