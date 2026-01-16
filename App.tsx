
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Briefcase, Layout, Plus, FileText, User as UserIcon, LogOut, ChevronRight, CloudCheck, CloudOff, RefreshCw } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CVBuilder from './pages/CVBuilder';
import Auth from './pages/Auth';
import { ResumeData, User, AuthState } from './types';
import { syncService } from './services/syncService';

interface AppContextType {
  auth: AuthState;
  login: (user: User, token: string, cloudResumes?: ResumeData[]) => void;
  logout: () => void;
  resumes: ResumeData[];
  saveResume: (resume: ResumeData) => void;
  deleteResume: (id: string) => void;
  isSyncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

const App: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('opal_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null, isAuthenticated: false };
  });

  const [resumes, setResumes] = useState<ResumeData[]>([]);

  // Load initial local data
  useEffect(() => {
    const saved = localStorage.getItem('opal_resumes');
    if (saved) {
      setResumes(JSON.parse(saved));
    }
  }, []);

  // Persist to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('opal_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('opal_resumes', JSON.stringify(resumes));
    
    // Cloud Sync: Push changes to cloud if authenticated
    if (auth.isAuthenticated && auth.user?.email && !isSyncing) {
      const timeoutId = setTimeout(async () => {
        setIsSyncing(true);
        await syncService.saveResumes(auth.user!.email, resumes);
        setIsSyncing(false);
      }, 1000); // Debounce sync
      return () => clearTimeout(timeoutId);
    }
  }, [resumes, auth.isAuthenticated]);

  const login = (user: User, token: string, cloudResumes?: ResumeData[]) => {
    setAuth({ user, token, isAuthenticated: true });
    if (cloudResumes) {
      setResumes(cloudResumes);
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    setResumes([]);
    localStorage.removeItem('opal_resumes');
  };

  const saveResume = (resume: ResumeData) => {
    setResumes(prev => {
      const idx = prev.findIndex(r => r.id === resume.id);
      const now = Date.now();
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...resume, lastModified: now };
        return next;
      }
      return [...prev, { ...resume, lastModified: now }];
    });
  };

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <AppContext.Provider value={{ auth, login, logout, resumes, saveResume, deleteResume, isSyncing }}>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {auth.isAuthenticated && (
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                      <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <Layout className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                        Opal CV Studio
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                      {isSyncing ? (
                        <RefreshCw className="w-3 h-3 text-indigo-500 animate-spin" />
                      ) : (
                        <CloudCheck className="w-3 h-3 text-emerald-500" />
                      )}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {isSyncing ? 'Syncing' : 'Cloud Active'}
                      </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1 text-slate-500 text-sm">
                      <UserIcon className="w-4 h-4" />
                      <span>{auth.user?.fullName}</span>
                    </div>
                    <button 
                      onClick={logout}
                      className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          )}

          <main className="flex-1">
            <Routes>
              <Route 
                path="/auth" 
                element={!auth.isAuthenticated ? <Auth /> : <Navigate to="/" />} 
              />
              <Route 
                path="/" 
                element={auth.isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/builder/:id" 
                element={auth.isAuthenticated ? <CVBuilder /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="*" 
                element={<Navigate to="/" />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
