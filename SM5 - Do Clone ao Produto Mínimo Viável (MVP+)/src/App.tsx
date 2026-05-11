/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Camera, 
  Shield, 
  Zap, 
  Globe, 
  Upload, 
  Link as LinkIcon, 
  X, 
  ChevronRight, 
  Info,
  MapPin,
  Clock,
  Settings,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Download,
  Edit2,
  Check,
  Trash2,
  BarChart3,
  Palette,
  Target,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ExifReader from 'exifreader';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from './lib/utils';
import * as piexif from 'piexifjs';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ExifData {
  [key: string]: string;
}

interface AnalyticsData {
  technicalScore: { subject: string; value: number }[];
  colorPalette: string[];
  exposureStats: { name: string; value: number }[];
}

interface AnalysisResult {
  exif: ExifData;
  narrative: string;
  imageUrl: string;
  originalFile?: File;
  mimeType: string;
  analytics: AnalyticsData;
}

export default function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [editedExif, setEditedExif] = useState<ExifData>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'narrative' | 'analytics'>('narrative');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractColorPalette = async (imageUrl: string): Promise<string[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(['#f4a261', '#e76f51', '#2a9d8f']);
        
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        
        const data = ctx.getImageData(0, 0, 50, 50).data;
        const colors: { [key: string]: number } = {};
        
        for (let i = 0; i < data.length; i += 40) { // Sample pixels
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          colors[hex] = (colors[hex] || 0) + 1;
        }
        
        const sortedColors = Object.entries(colors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([color]) => color);
          
        resolve(sortedColors);
      };
      img.onerror = () => resolve(['#f4a261', '#e76f51', '#2a9d8f']);
    });
  };

  const processImage = async (file: File | string) => {
    setIsLoading(true);
    setError(null);
    setActiveTab('narrative');
    try {
      let arrayBuffer: ArrayBuffer;
      let imageUrl: string;
      let mimeType: string;
      let originalFile: File | undefined;

      if (typeof file === 'string') {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Falha ao carregar imagem da URL.');
        mimeType = response.headers.get('content-type') || 'image/jpeg';
        arrayBuffer = await response.arrayBuffer();
        imageUrl = file;
      } else {
        originalFile = file;
        mimeType = file.type;
        arrayBuffer = await file.arrayBuffer();
        imageUrl = URL.createObjectURL(file);
      }

      const tags = ExifReader.load(arrayBuffer);
      const cleanTags: ExifData = {};
      for (const [key, value] of Object.entries(tags)) {
        if (value && value.description) {
          cleanTags[key] = String(value.description);
        }
      }

      // AI Analysis for Narrative AND Analytics
      const prompt = `
        Analise os seguintes metadados EXIF de uma fotografia.
        
        1. Crie uma narrativa curta (máximo 3 parágrafos) sobre a "alma" da foto.
        2. Forneça pontuações técnicas de 0 a 100 para: Exposição, Nitidez, Composição, Cor e Criatividade.
        3. Forneça uma distribuição simplificada de luminosidade (Sombras, Tons Médios, Realces) em porcentagem.
        
        Responda estritamente em formato JSON com a seguinte estrutura:
        {
          "narrative": "string",
          "technicalScore": [
            {"subject": "Exposição", "value": number},
            {"subject": "Nitidez", "value": number},
            {"subject": "Composição", "value": number},
            {"subject": "Cor", "value": number},
            {"subject": "Criatividade", "value": number}
          ],
          "exposureStats": [
            {"name": "Sombras", "value": number},
            {"name": "Tons Médios", "value": number},
            {"name": "Realces", "value": number}
          ]
        }
        
        Metadados:
        ${JSON.stringify(cleanTags, null, 2)}
      `;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const aiData = JSON.parse(aiResponse.text || "{}");
      const palette = await extractColorPalette(imageUrl);

      setAnalysis({
        exif: cleanTags,
        narrative: aiData.narrative || "Não foi possível gerar uma narrativa.",
        imageUrl,
        originalFile,
        mimeType,
        analytics: {
          technicalScore: aiData.technicalScore || [],
          colorPalette: palette,
          exposureStats: aiData.exposureStats || []
        }
      });
      setEditedExif(cleanTags);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao processar a imagem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSanitized = async () => {
    if (!analysis) return;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = analysis.imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Falha ao criar contexto do canvas');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sanitized_${analysis.originalFile?.name || 'image.jpg'}`;
        a.click();
        URL.revokeObjectURL(url);
      }, analysis.mimeType);
    } catch (err) {
      console.error(err);
      setError('Falha ao sanitizar imagem.');
    }
  };

  const updateTag = (key: string, value: string) => {
    setEditedExif(prev => ({ ...prev, [key]: value }));
    setEditingKey(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      setError('Por favor, envie um arquivo de imagem válido.');
    }
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      processImage(urlInput.trim());
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="text-xl font-black border-2 p-1 px-2 border-white/20 tracking-tighter">
            EX <span className="font-light opacity-60">INSIGHT</span>
          </div>
        </div>
        <div className="hidden md:flex space-x-8 text-[10px] font-bold tracking-widest text-white/40 uppercase">
          <a href="#" className="hover:text-accent transition-colors">Como Funciona</a>
          <a href="#" className="hover:text-accent transition-colors">Privacidade</a>
          <a href="#" className="hover:text-accent transition-colors">API</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase mb-8">
                <Zap className="w-3 h-3 text-accent" /> Intelligence Engine V2.5
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black mb-8 uppercase leading-[0.9] tracking-tighter">
                Desvende a <span className="text-accent italic font-serif font-normal lowercase">alma</span> <br />
                das suas fotos.
              </h1>
              
              <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light mb-16 leading-relaxed">
                Extração forense de metadados e análise narrativa com IA. 
                Privacidade total, processamento <span className="text-white/80 font-medium">100% local</span>.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
                {[
                  { icon: Shield, title: "Privacidade Total", desc: "Dados processados localmente. Segurança absoluta para seus ativos.", color: "text-green-500" },
                  { icon: Zap, title: "Performance", desc: "Extração ultrarrápida de tags EXIF, IPTC e XMP em milissegundos.", color: "text-orange-400" },
                  { icon: Activity, title: "Analytics", desc: "Análise técnica profunda e visualização de dados de exposição.", color: "text-blue-400" }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-card p-8 text-left border border-white/5 rounded-sm group hover:border-white/20 transition-all"
                  >
                    <feature.icon className={cn("w-6 h-6 mb-6", feature.color)} />
                    <h3 className="font-bold mb-2 uppercase text-xs tracking-widest">{feature.title}</h3>
                    <p className="text-[11px] text-white/30 leading-relaxed uppercase">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="text-left space-y-4">
                  <h2 className="uppercase font-black text-sm tracking-widest flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Analisar Arquivo
                  </h2>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "group relative border-2 border-dashed p-16 text-center rounded-sm transition-all cursor-pointer overflow-hidden",
                      isDragging ? "border-accent bg-accent/5" : "border-white/10 hover:border-white/30 bg-white/[0.02]"
                    )}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={onFileSelect} 
                      className="hidden" 
                      accept="image/*"
                    />
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-white/30 mb-6 tracking-[0.3em] uppercase group-hover:text-white/60 transition-colors">
                        {isDragging ? "Solte agora" : "Arraste e solte um arquivo aqui"}
                      </p>
                      <button className="bg-accent-dark text-black px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-transform">
                        Selecionar Imagem
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-4">
                  <h2 className="uppercase font-black text-sm tracking-widest flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Analisar URL
                  </h2>
                  <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold block">
                        Endereço da Imagem
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..." 
                          className="w-full bg-card border border-white/10 p-4 text-sm focus:outline-none focus:border-accent transition-colors pr-12 font-mono text-white/60"
                        />
                        <button 
                          type="submit"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-accent transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs uppercase font-bold tracking-widest max-w-md mx-auto flex items-center gap-3"
                >
                  <X className="w-4 h-4 cursor-pointer" onClick={() => setError(null)} />
                  {error}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              {/* Results Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                <div>
                  <button 
                    onClick={() => setAnalysis(null)}
                    className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors mb-4"
                  >
                    <X className="w-3 h-3" /> Voltar para o Início
                  </button>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Relatório de Análise</h2>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleDownloadSanitized}
                    className="flex items-center gap-2 px-6 py-2 border border-accent/30 text-[10px] font-bold uppercase tracking-widest hover:bg-accent/10 transition-colors text-accent"
                  >
                    <Shield className="w-3 h-3" /> Remover Metadados
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Baixar Relatório
                  </button>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex gap-8 border-b border-white/5">
                {[
                  { id: 'narrative', label: 'Narrativa da Alma', icon: Sparkles },
                  { id: 'analytics', label: 'Analytics Técnico', icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative",
                      activeTab === tab.id ? "text-accent" : "text-white/30 hover:text-white/60"
                    )}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Main Content */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="aspect-video bg-card border border-white/10 overflow-hidden group relative">
                    <img 
                      src={analysis.imageUrl} 
                      alt="Analyzed" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'narrative' ? (
                      <motion.div 
                        key="narrative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 text-accent">
                          <Sparkles className="w-5 h-5" />
                          <h3 className="text-sm font-black uppercase tracking-[0.3em]">A Alma da Fotografia</h3>
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <div className="text-xl md:text-2xl font-light leading-relaxed text-white/80 italic font-serif">
                            {analysis.narrative.split('\n').map((para, i) => (
                              <p key={i} className="mb-6">{para}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="analytics"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-12"
                      >
                        {/* Technical Radar Chart */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 text-blue-400">
                              <Target className="w-5 h-5" />
                              <h3 className="text-sm font-black uppercase tracking-[0.3em]">Perfil Técnico</h3>
                            </div>
                            <div className="h-[300px] w-full bg-white/[0.02] border border-white/5 rounded-sm p-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.analytics.technicalScore}>
                                  <PolarGrid stroke="#ffffff10" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10 }} />
                                  <Radar
                                    name="Score"
                                    dataKey="value"
                                    stroke="#f4a261"
                                    fill="#f4a261"
                                    fillOpacity={0.3}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-3 text-green-400">
                              <Palette className="w-5 h-5" />
                              <h3 className="text-sm font-black uppercase tracking-[0.3em]">Paleta de Cores</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <div className="flex h-24 w-full border border-white/5 rounded-sm overflow-hidden">
                                {analysis.analytics.colorPalette.map((color, i) => (
                                  <div 
                                    key={i} 
                                    className="flex-1 group relative cursor-pointer" 
                                    style={{ backgroundColor: color }}
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-opacity">
                                      <span className="text-[10px] font-mono font-bold uppercase">{color}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-1 gap-px bg-white/5">
                                {analysis.analytics.colorPalette.map((color, i) => (
                                  <div key={i} className="flex justify-between items-center p-3 bg-[#0a0a0a]">
                                    <div className="flex items-center gap-3">
                                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                      <span className="text-[10px] font-mono text-white/60 uppercase">{color}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Dominante {i + 1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Exposure Distribution */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-orange-400">
                            <BarChart3 className="w-5 h-5" />
                            <h3 className="text-sm font-black uppercase tracking-[0.3em]">Distribuição de Exposição</h3>
                          </div>
                          <div className="h-[200px] w-full bg-white/[0.02] border border-white/5 rounded-sm p-6">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={analysis.analytics.exposureStats} layout="vertical">
                                <XAxis type="number" hide domain={[0, 100]} />
                                <YAxis 
                                  dataKey="name" 
                                  type="category" 
                                  tick={{ fill: '#ffffff40', fontSize: 10 }} 
                                  width={80}
                                />
                                <Tooltip 
                                  cursor={{ fill: '#ffffff05' }}
                                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', fontSize: '10px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                  {analysis.analytics.exposureStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#444' : index === 1 ? '#888' : '#ccc'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: EXIF Data Grid */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                        <Settings className="w-3 h-3" /> Parâmetros Técnicos
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5">
                      {Object.entries(editedExif).slice(0, 12).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-4 bg-[#0a0a0a] group hover:bg-white/[0.02] transition-colors">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{key}</span>
                            {editingKey === key ? (
                              <input 
                                autoFocus
                                type="text"
                                defaultValue={value}
                                onBlur={(e) => updateTag(key, e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && updateTag(key, e.currentTarget.value)}
                                className="bg-white/5 border border-accent/50 p-1 px-2 text-[11px] font-mono text-white outline-none"
                              />
                            ) : (
                              <span className="text-[11px] font-mono text-white/80">{String(value)}</span>
                            )}
                          </div>
                          <button onClick={() => setEditingKey(key)} className="opacity-0 group-hover:opacity-100 p-2 hover:text-accent transition-all">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card p-6 border border-white/5">
                      <Camera className="w-4 h-4 text-accent mb-4" />
                      <div className="text-[9px] font-bold text-white/30 uppercase mb-1 tracking-widest">Dispositivo</div>
                      <div className="text-xs font-bold truncate">{editedExif.Make} {editedExif.Model || 'Desconhecido'}</div>
                    </div>
                    <div className="bg-card p-6 border border-white/5">
                      <Clock className="w-4 h-4 text-accent mb-4" />
                      <div className="text-[9px] font-bold text-white/30 uppercase mb-1 tracking-widest">Captura</div>
                      <div className="text-xs font-bold truncate">{editedExif.DateTimeOriginal || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <Loader2 className="w-12 h-12 text-accent animate-spin mb-8" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Processando Analytics</h2>
            <p className="text-white/40 text-sm max-w-xs font-light leading-relaxed">
              Extraindo paleta de cores, gerando perfil técnico e narrativa da alma...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center">
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
          © 2026 EXIF Insight — Forensic Intelligence
        </div>
      </footer>
    </div>
  );
}
