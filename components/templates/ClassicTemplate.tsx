
import React from 'react';
import { ResumeData } from '../../types';

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="flex flex-col bg-white font-serif text-slate-900 overflow-hidden" style={{ width: '794px', minHeight: '1123px' }}>
      <div className="px-16 py-16 flex flex-col flex-1">
        {/* Centered Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 tracking-wide uppercase leading-tight border-b-2 border-slate-900 pb-6 inline-block min-w-[300px]">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <div className="flex justify-center flex-wrap gap-x-4 text-[11px] font-sans text-slate-500 font-bold uppercase tracking-[0.15em] mt-4">
            <span>{personalInfo.location || 'Location Address'}</span>
            <span className="text-slate-300">•</span>
            <span>{personalInfo.email || 'Email Contact'}</span>
            {personalInfo.phone && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
          </div>
        </header>

        <div className="space-y-14">
          {/* Summary Section */}
          <section>
            <h2 className="text-[11px] font-black border-b border-slate-200 pb-2 mb-6 uppercase tracking-[0.3em] text-slate-400 text-center">
              Professional Summary
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-[14px] text-center italic leading-relaxed text-slate-800">
                "{personalInfo.summary || 'Summary placeholder...'}"
              </p>
            </div>
          </section>

          {/* Experience Section */}
          <section>
            <h2 className="text-[11px] font-black border-b border-slate-200 pb-2 mb-10 uppercase tracking-[0.3em] text-slate-400 text-center">
              Experience
            </h2>
            <div className="space-y-12">
              {experience.length > 0 ? experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold mb-1.5">
                    <h3 className="text-[17px] font-bold text-black leading-none">{exp.company || 'Company Name'}</h3>
                    <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-tighter">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-4">
                    <p className="text-[13px] italic text-slate-600 font-medium">{exp.position || 'Position Title'}</p>
                    <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest">{exp.location}</p>
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap px-4 border-l border-slate-100">
                    {exp.description || 'Describe your contributions and key successes...'}
                  </p>
                </div>
              )) : (
                <p className="text-slate-400 italic text-xs font-sans text-center">No experience records available.</p>
              )}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <h2 className="text-[11px] font-black border-b border-slate-200 pb-2 mb-8 uppercase tracking-[0.3em] text-slate-400 text-center">
              Education
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {education.map((ed) => (
                <div key={ed.id} className="text-center">
                  <h4 className="font-bold text-[15px] text-black mb-1">{ed.school}</h4>
                  <p className="text-[13px] text-slate-600 italic">
                    {ed.degree} {ed.field && `in ${ed.field}`} • {ed.startDate} — {ed.endDate}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-[11px] font-black border-b border-slate-200 pb-2 mb-6 uppercase tracking-[0.3em] text-slate-400 text-center">
              Expertise
            </h2>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[12px] font-sans text-slate-800 px-1 font-bold uppercase tracking-widest">
              {skills.map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-slate-900 rounded-full" />
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <div className="mt-auto px-16 py-10 border-t border-slate-50 flex flex-col items-center">
        <div className="w-12 h-[2px] bg-slate-200 mb-4" />
        <p className="text-[9px] font-sans font-black text-slate-300 uppercase tracking-[0.6em]">
          Opal Heritage Series
        </p>
      </div>
    </div>
  );
};

export default ClassicTemplate;
