
import React from 'react';
import { ResumeData } from '../../types';

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="flex flex-col bg-white font-sans text-slate-900 overflow-hidden" style={{ width: '794px', minHeight: '1123px' }}>
      {/* Accent Header */}
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 w-full" />
      
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col p-8 pt-12">
          <div className="space-y-10">
            {/* Contact Info */}
            <section>
              <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Contact</h2>
              <ul className="space-y-3">
                <li className="text-[11px] leading-tight break-words">
                  <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5">Location</span>
                  {personalInfo.location || 'San Francisco, CA'}
                </li>
                <li className="text-[11px] leading-tight break-words">
                  <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5">Email</span>
                  {personalInfo.email || 'alex@example.com'}
                </li>
                <li className="text-[11px] leading-tight">
                  <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5">Phone</span>
                  {personalInfo.phone || '+1 555 0000'}
                </li>
                {personalInfo.website && (
                  <li className="text-[11px] leading-tight">
                    <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5">Web</span>
                    {personalInfo.website}
                  </li>
                )}
              </ul>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Core Skills</h2>
              <div className="flex flex-col gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-700 uppercase">
                      <span>{skill.name}</span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-800" 
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education in Sidebar for Modern look */}
            <section>
              <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Education</h2>
              <div className="space-y-4">
                {education.map((ed) => (
                  <div key={ed.id}>
                    <p className="text-[11px] font-bold text-slate-800 leading-tight mb-0.5">{ed.degree}</p>
                    <p className="text-[10px] text-slate-500 mb-0.5">{ed.school}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{ed.startDate} – {ed.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-12 pt-16">
          <header className="mb-12 border-b border-slate-100 pb-10">
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-none">
              {personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : 'YOUR'} 
              <span className="text-indigo-600"> {personalInfo.fullName ? personalInfo.fullName.split(' ').slice(1).join(' ') : 'NAME'}</span>
            </h1>
            <p className="text-slate-600 text-[13px] leading-relaxed font-medium max-w-xl">
              {personalInfo.summary || 'Describe your professional journey and key value proposition...'}
            </p>
          </header>

          <div className="space-y-12">
            {/* Experience */}
            <section>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                Professional Experience
                <div className="h-px bg-slate-100 flex-1" />
              </h2>
              <div className="space-y-10">
                {experience.length > 0 ? experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-slate-100">
                    <div className="absolute -left-[6.5px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-indigo-600 shadow-sm" />
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-extrabold text-[15px] text-slate-900 uppercase tracking-tight">
                        {exp.position || 'Position Title'}
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-indigo-600 font-bold text-[11px] mb-3 uppercase tracking-wide">
                      {exp.company || 'Organization Name'}
                    </p>
                    <p className="text-slate-600 text-[12px] leading-relaxed font-medium">
                      {exp.description || 'Outline your achievements and core responsibilities...'}
                    </p>
                  </div>
                )) : (
                  <p className="text-slate-400 italic text-xs">No experience records added.</p>
                )}
              </div>
            </section>

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  Strategic Projects
                  <div className="h-px bg-slate-100 flex-1" />
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-50 p-4 rounded-xl">
                      <h3 className="font-bold text-[12px] text-slate-900 mb-1.5">{proj.name}</h3>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-medium">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      <footer className="px-14 py-6 border-t border-slate-50 flex justify-between items-center text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em]">
        <span>Modern Profession v2.0</span>
        <span>Generated by Opal CV Studio</span>
      </footer>
    </div>
  );
};

export default ModernTemplate;
