
import React from 'react';
import { ResumeData } from '../../types';

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="flex flex-col bg-white font-serif text-slate-900 overflow-hidden" style={{ width: '794px', minHeight: '1123px' }}>
      <div className="px-14 py-14 flex flex-col flex-1">
        <header className="text-center mb-10 border-b-2 border-slate-900 pb-12">
          <h1 className="text-4xl font-bold mb-4 tracking-tight uppercase tracking-[0.1em]">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <div className="flex justify-center flex-wrap gap-x-3 text-[12px] font-sans text-slate-600 font-medium uppercase tracking-wide">
            <span>{personalInfo.location || 'Location Address'}</span>
            <span className="text-slate-300">|</span>
            <span>{personalInfo.email || 'Email Contact'}</span>
            {personalInfo.phone && (
              <>
                <span className="text-slate-300">|</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
          </div>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="text-xs font-bold border-b-2 border-slate-800 pb-2 mb-6 uppercase tracking-[0.2em] text-slate-900">Career Summary</h2>
            <p className="text-[13px] text-justify font-sans leading-relaxed text-slate-700 px-1">
              {personalInfo.summary || 'Summary placeholder...'}
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold border-b-2 border-slate-800 pb-2 mb-8 uppercase tracking-[0.2em] text-slate-900">Employment History</h2>
            <div className="space-y-10 px-1">
              {experience.length > 0 ? experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold mb-1">
                    <h3 className="text-[15px] font-bold uppercase tracking-wide text-black">{exp.company || 'Company'}</h3>
                    <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-tighter">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[13px] italic text-slate-600 mb-4 font-medium">{exp.position || 'Position'}</p>
                  <p className="text-[13px] font-sans leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {exp.description || 'Describe your contributions...'}
                  </p>
                </div>
              )) : (
                <p className="text-slate-400 italic text-xs font-sans">No experience records added.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold border-b-2 border-slate-800 pb-2 mb-8 uppercase tracking-[0.2em] text-slate-900">Educational Background</h2>
            <div className="space-y-6 px-1">
              {education.map((ed) => (
                <div key={ed.id} className="flex justify-between items-baseline font-sans">
                  <div>
                    <span className="font-bold text-[14px] text-black uppercase tracking-tight">{ed.school}</span>
                    <span className="text-slate-400 mx-2">|</span>
                    <span className="text-[13px] text-slate-700 italic">{ed.degree} {ed.field && `in ${ed.field}`}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{ed.startDate} — {ed.endDate}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold border-b-2 border-slate-800 pb-2 mb-6 uppercase tracking-[0.2em] text-slate-900">Professional Skills</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-[12px] font-sans text-slate-700 px-1 font-medium">
              {skills.map(s => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rotate-45" />
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <div className="mt-auto px-14 py-8 bg-slate-50 border-t border-slate-100">
        <p className="text-[8px] font-sans font-black text-slate-400 uppercase tracking-[0.4em] text-center">
          Opal CV Studio • Classic Professional Series
        </p>
      </div>
    </div>
  );
};

export default ClassicTemplate;
