import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWords, addWord, deleteWord, clearError } from './store/wordSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Languages, Send, Sparkles, Globe, History, CheckCircle2, Loader2, AlertTriangle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const LANGUAGES = [
    { code: 'uz', name: 'O‘zbek', flag: '🇺🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const TranslatorApp = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.words);
    const [formData, setFormData] = useState({ name: '', source: 'en', target: [] });
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        dispatch(fetchWords());
    }, [dispatch]);

    // Xatolik xabarini 5 sekunddan keyin avtomatik o'chirish
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => dispatch(clearError()), 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleTargetToggle = (code) => {
        setFormData(prev => ({
            ...prev,
            target: prev.target.includes(code)
                ? prev.target.filter(c => c !== code)
                : [...prev.target, code].slice(0, 3)
        }));
    };

    const handleTranslate = async (e) => {
        e.preventDefault();
        if (!formData.name || formData.target.length === 0) return;
        setIsTranslating(true);
        await dispatch(addWord(formData));
        dispatch(fetchWords());
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#8b5cf6'] });
        setFormData({ ...formData, name: '', target: [] });
        setIsTranslating(false);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20 relative overflow-x-hidden">
            
            {/* Ogohlantirish (Error Alert) */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 20, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-5 left-0 right-0 z-[100] flex justify-center px-6"
                    >
                        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] flex items-center gap-4 max-w-md w-full">
                            <div className="bg-red-500 p-2 rounded-xl text-white">
                                <AlertTriangle size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-red-100">Ruxsat rad etildi!</p>
                                <p className="text-xs text-red-200/80 leading-tight">{error}</p>
                            </div>
                            <button onClick={() => dispatch(clearError())} className="text-red-300 hover:text-white transition">
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                            <Languages size={24} className="text-white" />
                        </div>
                        <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                            WORDTRIPLET AI
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 pt-12">
                {/* Search Card */}
                <motion.div className="bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl mb-16">
                    <form onSubmit={handleTranslate} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                            <div className="md:col-span-7 space-y-3">
                                <label className="text-sm font-bold text-slate-400 ml-1">SOURCE TEXT</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Translate anything..."
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-5 space-y-3">
                                <label className="text-sm font-bold text-slate-400 ml-1">FROM</label>
                                <select 
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
                                    value={formData.source}
                                    onChange={e => setFormData({...formData, source: e.target.value})}
                                >
                                    {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-bold text-slate-400 ml-1 uppercase">Target Languages</p>
                            <div className="flex flex-wrap gap-3">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        onClick={() => handleTargetToggle(lang.code)}
                                        className={`px-6 py-3 rounded-2xl font-bold border transition-all ${
                                            formData.target.includes(lang.code)
                                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/[0.05] border-white/5 text-slate-400 hover:border-white/20'
                                        }`}
                                    >
                                        {lang.flag} {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="w-full py-5 rounded-2xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
                            disabled={isTranslating}
                        >
                            {isTranslating ? <Loader2 className="animate-spin" /> : <><Send size={20}/> Translate Now</>}
                        </button>
                    </form>
                </motion.div>

                {/* Grid Results */}
                <div className="space-y-8">
                    <h2 className="text-slate-400 font-bold flex items-center gap-2 tracking-widest uppercase text-sm">
                        <History size={16} /> Recent Translations
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="group relative bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all"
                                >
                                    <button 
                                        onClick={() => dispatch(deleteWord(item.word.id))}
                                        className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-red-500/0 hover:bg-red-500/10 rounded-xl"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="space-y-4">
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-lg border border-blue-500/20 uppercase tracking-tighter">
                                            {item.lang}
                                        </span>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Original</p>
                                            <p className="text-lg font-bold text-slate-200">{item.word.name}</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Translation</p>
                                            <p className="text-xl font-extrabold text-white">{item.translation}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TranslatorApp;