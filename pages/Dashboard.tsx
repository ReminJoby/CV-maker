
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Trash2, 
  Download,
  Search,
  Zap,
  Upload,
  X,
  Sparkles,
  FileJson,
  CheckCircle,
  FileUp,
  Loader2
} from 'lucide-react';
import { useApp } from '../App';
import { ResumeData } from '../types';
import { generateHeroImage, parseResumeFromText, parseResumeFromPDF } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { resumes, deleteResume, saveResume } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const [importMode, setImportMode] = useState<'ai' | 'file' | 'pdf'>('ai');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadHero = async () => {
      const savedHero = localStorage.getItem('dashboard_hero');
      if (savedHero) {
        setHeroImage(savedHero);
      }
    };
    loadHero();
  }, []);

  const handleCreateNew = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const newResume: ResumeData = {
      id,
      title: 'Untitled Resume',
      lastModified: Date.now(),
      template: 'modern',
      personalInfo: { fullName: '', email: '', phone: '', location: '', website: '', summary: '' },
      experience: [],
      education: [],
      skills: [],
      projects: []
    };
    saveResume(newResume);
    navigate(`/builder/${id}`);
  };

  const handleDuplicate = (resume: ResumeData) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newResume = { ...resume, id, title: `${resume.title} (Copy)`, lastModified: Date.now() };
    saveResume(newResume);
  };

  const handleExportData = (resume: ResumeData) => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title.replace(/\s+/g, '_')}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const processParsedData = (parsedData: any) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newResume: ResumeData = {
      id,
      title: parsedData.title || 'Imported Resume',
      lastModified: Date.now(),
      template: 'modern',
      personalInfo: {
        fullName: parsedData.personalInfo?.fullName || '',
        email: parsedData.personalInfo?.email || '',
        phone: parsedData.personalInfo?.phone || '',
        location: parsedData.personalInfo?.location || '',
        website: parsedData.personalInfo?.website || '',
        summary: parsedData.personalInfo?.summary || ''
      },
      experience: (parsedData.experience || []).map((e: any) => ({
        ...e,
        id: Math.random().toString(36).substring(2, 9),
        company: e.company || '',
        position: e.position || '',
        location: e.location || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        description: e.description || '',
        current: e.current || false
      })),
      education: (parsedData.education || []).map((ed: any) => ({
        ...ed,
        id: Math.random().toString(36).substring(2, 9),
        school: ed.school || '',
        degree: ed.degree || '',
        field: ed.field || '',
        location: ed.location || '',
        startDate: ed.startDate || '',
        endDate: ed.endDate || ''
      })),
      skills: (parsedData.skills || []).map((s: any) => ({
        ...s,
        id: Math.random().toString(36).substring(2, 9),
        name: s.name || '',
        level: s.level || 3
      })),
      projects: []
    };
    saveResume(newResume);
    setShowImportModal(false);
    navigate(`/builder/${id}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const id = Math.random().toString(36).substring(2, 9);
        const importedResume = { ...data, id, lastModified: Date.now() };
        saveResume(importedResume);
        setShowImportModal(false);
        navigate(`/builder/${id}`);
      } catch (err) {
        alert("Invalid JSON file format.");
      }
    };
    reader.readAsText(file);
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fast check for file size (Gemini has limits, and huge files are slow)
    if (file.size > 10 * 1024 * 1024) {
      alert("PDF is too large. Please use a file smaller than 10MB for fast processing.");
      return;
    }

    setIsImporting(true);
    setImportStatus('Reading file...');
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setImportStatus('Extracting content with Gemini...');
        const base64 = (event.target?.result as string).split(',')[1];
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Processing timeout')), 60000)
        );

        try {
          const parsedData = await Promise.race([
            parseResumeFromPDF(base64),
            timeoutPromise
          ]) as any;

          if (parsedData) {
            setImportStatus('Processing data...');
            processParsedData(parsedData);
          } else {
            alert("Failed to extract data. The PDF might be too complex or contain mainly images.");
          }
        } catch (error) {
          console.error(error);
          alert("Processing took too long. Please try a simpler PDF or copy-paste text instead.");
        } finally {
          setIsImporting(false);
          setImportStatus('');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert("Error reading PDF file.");
      setIsImporting(false);
      setImportStatus('');
    }
  };

  const handleAIImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    setImportStatus('Analyzing text...');
    const parsedData = await parseResumeFromText(importText);
    if (parsedData) {
      processParsedData(parsedData);
    } else {
      alert("AI failed to parse the text. Please try pasting a cleaner version of your resume.");
    }
    setIsImporting(false);
    setImportStatus('');
  };

  const handleGenerateHero = async () => {
    setIsGeneratingImage(true);
    const prompt = "A striking, abstract image representing intelligent data analysis. Professional blues and purples.";
    const img = await generateHeroImage(prompt);
    if (img) {
      setHeroImage(img);
      localStorage.setItem('dashboard_hero', img);
    }
    setIsGeneratingImage(false);
  };

  const filteredResumes = resumes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 min-h-[320px] flex items-center shadow-2xl">
        {heroImage ? (
          <img 
            src={heroImage} 
            alt="Intelligent Data Analysis" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 opacity-80" />
        )}
        
        <div className="relative z-10 p-8 md:p-12 w-full max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Build your career with <span className="text-blue-400">Intelligence</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Create professional, ATS-optimized resumes in minutes. 
            Import existing work or use AI suggestions to craft a perfect narrative.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleCreateNew}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center space-x-2 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              <Plus className="w-5 h-5" />
              <span>Create New CV</span>
            </button>
            <button 
              onClick={() => setShowImportModal(true)}
              className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-50 rounded-xl font-semibold flex items-center space-x-2 transition-all shadow-lg"
            >
              <Upload className="w-5 h-5" />
              <span>Import Existing CV</span>
            </button>
            <button 
              onClick={handleGenerateHero}
              disabled={isGeneratingImage}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold flex items-center space-x-2 backdrop-blur-sm transition-all"
            >
              <Zap className={`w-5 h-5 ${isGeneratingImage ? 'animate-pulse text-yellow-400' : ''}`} />
              <span>{isGeneratingImage ? 'Generating...' : 'Enhance View'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CV Grid */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">My Resumes</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search resumes..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div 
                key={resume.id}
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => handleExportData(resume)}
                      className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Export Data (JSON)"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                    {resume.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-slate-400 text-sm mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {new Date(resume.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => navigate(`/builder/${resume.id}`)}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all text-sm font-semibold"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDuplicate(resume)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteResume(resume.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No resumes found matching your search.</p>
            <button 
              onClick={handleCreateNew}
              className="mt-4 text-indigo-600 font-semibold hover:underline"
            >
              Create your first one
            </button>
          </div>
        )}
      </section>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Import Existing CV
              </h2>
              <button 
                onClick={() => !isImporting && setShowImportModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                disabled={isImporting}
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              {!isImporting && (
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6 space-x-1">
                  <button 
                    onClick={() => setImportMode('ai')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${importMode === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Text
                  </button>
                  <button 
                    onClick={() => setImportMode('pdf')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${importMode === 'pdf' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    PDF (Fast)
                  </button>
                  <button 
                    onClick={() => setImportMode('file')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${importMode === 'file' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    JSON
                  </button>
                </div>
              )}

              {importMode === 'ai' && !isImporting && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
                    <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
                    <p className="text-xs text-indigo-800 leading-relaxed">
                      Paste the text content from your existing resume for instant parsing.
                    </p>
                  </div>
                  <textarea 
                    className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm leading-relaxed"
                    placeholder="Paste your resume text here..."
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                  <button 
                    onClick={handleAIImport}
                    disabled={isImporting || !importText.trim()}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Start AI Parsing</span>
                  </button>
                </div>
              )}

              {(importMode === 'pdf' || isImporting) && (
                <div 
                  className={`flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl transition-colors group ${!isImporting ? 'hover:border-indigo-300 cursor-pointer' : 'bg-slate-50'}`} 
                  onClick={() => !isImporting && importMode === 'pdf' && pdfInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    ref={pdfInputRef} 
                    onChange={handlePDFUpload} 
                  />
                  {isImporting ? (
                    <div className="text-center animate-in fade-in duration-300 px-8">
                      <div className="p-5 bg-indigo-50 rounded-full mb-4 inline-block">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">{importStatus}</h3>
                      <p className="text-sm text-slate-500 mt-2">Optimized for high-speed extraction</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-5 bg-slate-50 rounded-full mb-4 group-hover:bg-indigo-50 transition-colors">
                        <FileUp className="w-10 h-10 text-slate-300 group-hover:text-indigo-400" />
                      </div>
                      <h3 className="font-bold text-slate-700">Select PDF resume</h3>
                      <p className="text-sm text-slate-400 mt-1 px-10 text-center">Fast AI parsing powered by Gemini 3 Flash.</p>
                    </>
                  )}
                </div>
              )}

              {importMode === 'file' && !isImporting && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-300 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                  />
                  <div className="p-5 bg-slate-50 rounded-full mb-4 group-hover:bg-indigo-50 transition-colors">
                    <FileJson className="w-10 h-10 text-slate-300 group-hover:text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-slate-700">Select .json file</h3>
                  <p className="text-sm text-slate-400 mt-1">Upload an Opal CV data file.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
