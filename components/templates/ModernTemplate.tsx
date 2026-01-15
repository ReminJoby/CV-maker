
import React from 'react';
import { ResumeData } from '../../types';

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="flex flex-col bg-white font-sans overflow-hidden" style={{ width: '794px', minHeight: '1123px' }}>
      <div className="h-4 bg-indigo-600 w-full" />
      
      <div className="px-14 py-14 flex flex-col flex-1">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">
            <span>{personalInfo.location || 'Location'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>{personalInfo.email || 'email@example.com'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>{personalInfo.phone || 'Phone'}</span>
            {personalInfo.website && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>
          <div className="max-w-3xl">
            <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
              {personalInfo.summary || 'Strategic summary...'}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-12 flex-1">
          {/* Main Column */}
          <div className="col-span-8 space-y-10">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] whitespace-nowrap">Professional Experience</h2>
                <div className="h-px bg-slate-200 flex-1 mt-0.5" />
              </div>
              <div className="space-y-8">
                {experience.length > 0 ? experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-extrabold text-[15px] text-slate-900">
                        {exp.position || 'Position Title'}
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-indigo-600 font-bold text-[11px] mb-3 uppercase tracking-wide">
                      {exp.company || 'Organization'}
                    </p>
                    <p className="text-slate-600 text-[12px] leading-relaxed whitespace-pre-wrap font-medium">
                      {exp.description || 'Description of achievements...'}
                    </p>
                  </div>
                )) : (
                  <p className="text-slate-400 italic text-xs">No experience added yet.</p>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] whitespace-nowrap">Academic Background</h2>
                <div className="h-px bg-slate-200 flex-1 mt-0.5" />
              </div>
              <div className="space-y-6">
                {education.map((ed) => (
                  <div key={ed.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-[14px] text-slate-900">
                        {ed.degree} {ed.field && `in ${ed.field}`}
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {ed.startDate} — {ed.endDate}
                      </span>
                    </div>
                    <p className="text-indigo-600 text-[11px] font-bold uppercase tracking-wider">{ed.school}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="col-span-4 space-y-10">
            <section>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 inline-block border-b-2 border-indigo-600 pb-2">Skills & Tools</h2>
              <div className="flex flex-col gap-4 mt-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest">
                      <span>{skill.name}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600" 
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {projects.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 inline-block border-b-2 border-indigo-600 pb-2">Top Projects</h2>
                <div className="space-y-6">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <h3 className="font-bold text-xs text-slate-900 mb-1">{proj.name}</h3>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-medium">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className="px-14 py-8 bg-slate-50 border-t border-slate-100">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center">
          Opal CV Studio • Modern Professional Edition
        </p>
      </div>
    </div>
  );
};

export default ModernTemplate;
