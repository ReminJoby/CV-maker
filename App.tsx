
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Briefcase, Layout, Plus, FileText, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CVBuilder from './pages/CVBuilder';
import Auth from './pages/Auth';
import { ResumeData, User, AuthState } from './types';

// Mock DB Initial Data
const INITIAL_CV_LIST: ResumeData[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    lastModified: Date.now() - 3600000,
    template: 'modern',
    personalInfo: {
      fullName: 'Alex River',
      email: 'alex.river@example.com',
      phone: '+1 (555) 012-3456',
      location: 'San Francisco, CA',
      website: 'alexriver.dev',
      summary: 'Innovative Frontend Developer with 6+ years of experience building scalable web applications. Expert in React, TypeScript, and modern UI/UX principles.'
    },
    experience: [
      {
        id: 'e1',
        company: 'TechFlow Solutions',
        position: 'Senior React Developer',
        location: 'Remote',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: 'Led the development of a micro-frontend architecture using React and Module Federation. Improved application performance by 40% through code-splitting and optimization.'
      }
    ],
    education: [
      {
        id: 'ed1',
        school: 'Stanford University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Stanford, CA',
        startDate: '2014-09',
        endDate: '2018-06',
        gpa: '3.9'
      }
    ],
    skills: [
      { id: 's1', name: 'React', level: 5 },
      { id: 's2', name: 'TypeScript', level: 5 },
      { id: 's3', name: 'Tailwind CSS', level: 4 }
    ],
    projects: [
      { id: 'p1', name: 'Opal UI Kit', description: 'A highly accessible React component library used by 50+ internal teams.' }
    ]
  }
];

interface AppContextType {
  auth: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
  resumes: ResumeData[];
  saveResume: (resume: ResumeData) => void;
  deleteResume: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('opal_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null, isAuthenticated: false };
  });

  const [resumes, setResumes] = useState<ResumeData[]>(() => {
    const saved = localStorage.getItem('opal_resumes');
    return saved ? JSON.parse(saved) : INITIAL_CV_LIST;
  });

  useEffect(() => {
    localStorage.setItem('opal_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('opal_resumes', JSON.stringify(resumes));
  }, [resumes]);

  const login = (user: User, token: string) => {
    setAuth({ user, token, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
  };

  const saveResume = (resume: ResumeData) => {
    setResumes(prev => {
      const idx = prev.findIndex(r => r.id === resume.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...resume, lastModified: Date.now() };
        return next;
      }
      return [...prev, { ...resume, lastModified: Date.now() }];
    });
  };

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <AppContext.Provider value={{ auth, login, logout, resumes, saveResume, deleteResume }}>
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
                  <div className="flex items-center space-x-4">
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
