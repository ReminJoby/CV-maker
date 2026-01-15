
import React from 'react';
import { ResumeData } from '../../types';

const ATSTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="flex flex-col bg-white font-sans text-black overflow-hidden shadow-none border-0" style={{ width: '794px', minHeight: '1123px' }}>
      <div className="px-14 py-14 flex flex-col flex-1">
        <header className="text-center border-b-2 border-black pb-10 mb-10">
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-4">
            {personalInfo.fullName || 'FULL NAME'}
          </h1>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-800">
            {personalInfo.location || 'City, Country'} | {personalInfo.phone || 'Phone'} | {personalInfo.email || 'Email'}
            {personalInfo.website && ` | ${personalInfo.website}`}
          </div>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="text-[12px] font-bold uppercase border-b-2 border-black pb-2 mb-5 tracking-widest text-black">Summary</h2>
            <p className="text-[12px] leading-relaxed text-black">
              {personalInfo.summary || 'Summary detail...'}
            </p>
          </section>

          <section>
            <h2 className="text-[12px] font-bold uppercase border-b-2 border-black pb-2 mb-8 tracking-widest text-black">Professional Experience</h2>
            <div className="space-y-8">
              {experience.length > 0 ? experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[13px] font-bold uppercase text-black tracking-wide">{exp.company || 'Organization'}</span>
                    <span className="text-[11px] font-bold">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[12px] italic font-bold text-slate-700 mb-3">{exp.position || 'Title'}</div>
                  <div className="text-[12px] leading-relaxed text-black whitespace-pre-wrap pl-5 border-l-2 border-slate-100">
                    {exp.description || 'Contribution details...'}
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 italic text-[11px]">Work history placeholder.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-[12px] font-bold uppercase border-b-2 border-black pb-2 mb-5 tracking-widest text-black">Technical Proficiencies</h2>
            <div className="text-[12px] leading-relaxed text-black">
              <span className="font-bold">Core Skills:</span> {skills.map(s => s.name).join(', ')}
            </div>
          </section>

          <section>
            <h2 className="text-[12px] font-bold uppercase border-b-2 border-black pb-2 mb-5 tracking-widest text-black">Education</h2>
            <div className="space-y-6">
              {education.map((ed) => (
                <div key={ed.id} className="flex justify-between items-baseline">
                  <div className="text-[12px]">
                    <span className="font-bold uppercase text-black">{ed.school || 'Institution'}</span>
                    <span className="mx-4 text-slate-300">|</span>
                    <span className="font-medium italic">{ed.degree} {ed.field && `in ${ed.field}`}</span>
                  </div>
                  <span className="text-[11px] font-bold">{ed.startDate} - {ed.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-auto py-12 bg-white text-center">
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.5em]">
          ATS Optimized Resume &bull; Opal CV Studio
        </p>
      </div>
    </div>
  );
};

export default ATSTemplate;
