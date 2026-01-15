
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Download,
  Sparkles,
  Layout as LayoutIcon,
  Briefcase,
  User as UserIconLucide,
  Loader2,
  Printer
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useApp } from '../App';
import { ResumeData, ResumeTemplate, Experience, Education } from '../types';
import ModernTemplate from '../components/templates/ModernTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ATSTemplate from '../components/templates/ATSTemplate';
import { getAIOptimizationTips } from '../services/geminiService';

const CVBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resumes, saveResume } = useApp();
  
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education' | 'design'>('info');
  const [showPreview, setShowPreview] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = resumes.find(res => res.id === id);
    if (r) setResume(r);
    else navigate('/');
  }, [id, resumes, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (previewWrapperRef.current && printRef.current) {
        const wrapperWidth = previewWrapperRef.current.clientWidth - 64;
        const resumeWidth = 794; 
        if (wrapperWidth < resumeWidth) {
          setScale(wrapperWidth / resumeWidth);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showPreview, resume?.template]);

  if (!resume) return null;

  const updateResume = (updates: Partial<ResumeData>) => {
    setResume(prev => prev ? { ...prev, ...updates } : null);
  };

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateResume({ personalInfo: { ...resume.personalInfo, [name]: value } });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substring(2, 9),
      company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false
    };
    updateResume({ experience: [newExp, ...resume.experience] });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    updateResume({
      experience: resume.experience.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
    });
  };

  const addEducation = () => {
    const newEd: Education = {
      id: Math.random().toString(36).substring(2, 9),
      school: '', degree: '', field: '', location: '', startDate: '', endDate: ''
    };
    updateResume({ education: [newEd, ...resume.education] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    updateResume({
      education: resume.education.map(ed => ed.id === id ? { ...ed, ...updates } : ed)
    });
  };

  const handleSave = () => {
    saveResume(resume);
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    handleSave();
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.print-container') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.width = '794px';
            clonedElement.style.minHeight = '1123px';
            clonedElement.style.position = 'static';
            clonedElement.style.display = 'block';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try the Print option instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    handleSave();
    window.print();
  };

  const handleOptimizeSummary = async () => {
    if (!resume.personalInfo.summary) return;
    setIsOptimizing(true);
    const tips = await getAIOptimizationTips('Summary', resume.personalInfo.summary);
    alert("AI Suggestions:\n\n" + tips.map((t: string) => `• ${t}`).join('\n'));
    setIsOptimizing(false);
  };

  const renderTemplate = () => {
    const props = { data: resume };
    switch (resume.template) {
      case 'modern': return <ModernTemplate {...props} />;
      case 'classic': return <ClassicTemplate {...props} />;
      case 'ats': return <ATSTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Editor Section */}
      <div className={`flex-1 flex flex-col border-r border-slate-200 transition-all duration-300 ${showPreview ? 'hidden' : 'flex'}`}>
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
            <input 
              type="text" 
              value={resume.title}
              onChange={(e) => updateResume({ title: e.target.value })}
              className="text-lg font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-48 md:w-auto shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center space-x-2 font-bold transition-all"
            >
              <Save className="w-5 h-5" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button 
              onClick={() => setShowPreview(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex md:hidden items-center transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto bg-white px-6 border-b border-slate-200 hide-scrollbar">
          {[
            { id: 'info', label: 'Basic Info', icon: UserIconLucide },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'education', label: 'Education', icon: LayoutIcon },
            { id: 'design', label: 'Layout & Design', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          {activeTab === 'info' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    name="fullName" 
                    value={resume.personalInfo.fullName} 
                    onChange={handlePersonalInfo}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white shadow-sm transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <input 
                    name="email" 
                    value={resume.personalInfo.email} 
                    onChange={handlePersonalInfo}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white shadow-sm transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                  <input 
                    name="phone" 
                    value={resume.personalInfo.phone} 
                    onChange={handlePersonalInfo}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white shadow-sm transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                  <input 
                    name="location" 
                    value={resume.personalInfo.location} 
                    onChange={handlePersonalInfo}
                    placeholder="City, State"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white shadow-sm transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Summary</label>
                  <button 
                    onClick={handleOptimizeSummary}
                    disabled={isOptimizing || !resume.personalInfo.summary}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
                    <span>AI Optimize</span>
                  </button>
                </div>
                <textarea 
                  name="summary" 
                  value={resume.personalInfo.summary} 
                  onChange={handlePersonalInfo}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-white shadow-sm transition-all text-slate-700" 
                  placeholder="Tell your professional story..."
                />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Experience</h3>
                <button 
                  onClick={addExperience}
                  className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-bold">Add New</span>
                </button>
              </div>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative group shadow-sm hover:shadow-md transition-all">
                  <button 
                    onClick={() => updateResume({ experience: resume.experience.filter(e => e.id !== exp.id) })}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                    />
                    <input 
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                    />
                  </div>
                  <textarea 
                    placeholder="Achievements and responsibilities..."
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mt-4 resize-none bg-white shadow-sm text-slate-700"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Education</h3>
                <button 
                  onClick={addEducation}
                  className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-bold">Add New</span>
                </button>
              </div>
              {resume.education.map((ed) => (
                <div key={ed.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative group shadow-sm hover:shadow-md transition-all">
                  <button 
                    onClick={() => updateResume({ education: resume.education.filter(e => e.id !== ed.id) })}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      placeholder="School / University"
                      value={ed.school}
                      onChange={(e) => updateEducation(ed.id, { school: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                    />
                    <input 
                      placeholder="Degree / Major"
                      value={ed.degree}
                      onChange={(e) => updateEducation(ed.id, { degree: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800">Choose Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['modern', 'classic', 'ats'] as ResumeTemplate[]).map((t) => (
                  <button 
                    key={t}
                    onClick={() => updateResume({ template: t })}
                    className={`p-4 border-2 rounded-2xl text-left transition-all group ${
                      resume.template === t 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-slate-200 hover:border-indigo-200 bg-white shadow-sm'
                    }`}
                  >
                    <div className={`w-full aspect-[3/4] rounded shadow-sm mb-4 border transition-colors ${
                      t === 'modern' ? 'bg-indigo-100 border-indigo-200' : t === 'classic' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'
                    }`} />
                    <span className="capitalize font-bold text-slate-800">{t}</span>
                    <p className="text-xs text-slate-500 mt-1">Professional layout</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div 
        ref={previewWrapperRef}
        className={`flex-1 bg-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${showPreview ? 'fixed inset-0 z-[60]' : 'hidden md:flex'}`}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            {showPreview && (
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
            )}
            <div className="flex items-center space-x-2 text-indigo-600">
              <Eye className="w-4 h-4" />
              <h3 className="font-bold text-slate-700">Live Preview</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrint}
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl flex items-center space-x-2 font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-12 flex justify-center pattern-grid bg-slate-300/40">
          <div 
            className="print-container bg-white shadow-2xl origin-top transition-transform duration-200 ease-out"
            style={{ 
              width: '794px',
              minHeight: '1123px',
              transform: `scale(${scale})`,
              marginBottom: `${(1 - scale) * -1123}px`
            }}
          >
            <div ref={printRef} className="h-full w-full">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
