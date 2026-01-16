
import React from 'react';
import { ResumeData } from '../../types';

const ATSTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="flex flex-col bg-white font-sans text-black overflow-hidden shadow-none border-0" style={{ width: '794px', minHeight: '1123px' }}>
      <div className="px-16 py-16 flex flex-col flex-1">
        {/* Simple, Non-Graphical Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">
            {personalInfo.fullName || 'FULL NAME'}
          </h1>
          <div className="text-[12px] font-medium text-slate-900 space-x-2">
            <span>{personalInfo.location || 'Location'}</span>
            <span>|</span>
            <span>{personalInfo.phone || 'Phone'}</span>
            <span>|</span>
            <span className="font-bold underline">{personalInfo.email || 'Email'}</span>
            {personalInfo.website && (
              <>
                <span>|</span>
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>
        </header>

        <div className="space-y-10">
          {/* Summary */}
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b-2 border-black pb-1 mb-4 tracking-wider text-black">Professional Summary</h2>
            <p className="text-[12px] leading-relaxed text-slate-800">
              {personalInfo.summary || 'Strategic professional summary...'}
            </p>
          </section>

          {/* Work Experience */}
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b-2 border-black pb-1 mb-6 tracking-wider text-black">Professional Experience</h2>
            <div className="space-y-8">
              {experience.length > 0 ? experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-[13px] font-bold text-black uppercase">{exp.company || 'Company'}</span>
                    <span className="text-[11px] font-bold">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="text-[12px] italic font-bold text-slate-800">{exp.position || 'Title'}</div>
                    <div className="text-[11px] font-medium text-slate-600 uppercase">{exp.location}</div>
                  </div>
                  <div className="text-[12px] leading-relaxed text-slate-800 pl-4 border-l border-slate-100">
                    {exp.description ? (
                      <ul className="list-disc space-y-1.5 ml-1">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                          <li key={i} className="pl-1">
                            {line.replace(/^[-•]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Achievement overview...'
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 italic text-[11px]">Work history record placeholder.</p>
              )}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b-2 border-black pb-1 mb-4 tracking-wider text-black">Technical Skills</h2>
            <div className="text-[12px] leading-relaxed text-slate-800">
              <span className="font-bold">Software & Tools:</span> {skills.map(s => s.name).join(', ')}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b-2 border-black pb-1 mb-6 tracking-wider text-black">Education</h2>
            <div className="space-y-6">
              {education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[12px] font-bold uppercase text-black">{ed.school || 'Institution'}</span>
                    <span className="text-[11px] font-bold">{ed.startDate} - {ed.endDate}</span>
                  </div>
                  <div className="text-[12px] italic">{ed.degree} {ed.field && `in ${ed.field}`}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-auto py-8 text-center bg-slate-50 border-t border-slate-100">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          ATS-Verified Document &bull; Created with Opal CV Studio
        </p>
      </div>
    </div>
  );
};

export default ATSTemplate;
