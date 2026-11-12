import React from 'react';
import { EDUCATIONAL_LESSONS } from '../data/abacusData';
import { LessonPage } from '../types';
import { BookOpen, Sparkles, ArrowRight, Check } from 'lucide-react';

interface LessonsProps {
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  onApplyPreset: (preset: { [exponent: number]: number }) => void;
}

export const Lessons: React.FC<LessonsProps> = ({
  currentLessonId,
  onSelectLesson,
  onApplyPreset,
}) => {
  const currentLesson = EDUCATIONAL_LESSONS.find(l => l.id === currentLessonId) || EDUCATIONAL_LESSONS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lesson Navigation sidebar */}
      <div className="lg:col-span-1 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          Lesson Syllabus
        </h3>
        <div className="flex flex-col gap-2 mt-2">
          {EDUCATIONAL_LESSONS.map((lesson, idx) => {
            const isActive = lesson.id === currentLessonId;
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-start gap-3 group relative overflow-hidden ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-medium'
                    : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                )}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isActive ? 'bg-emerald-500 text-white shadow-sm' : 'bg-stone-200 dark:bg-stone-800'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="text-sm leading-tight font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {lesson.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lesson Content Box */}
      <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 md:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Active Lesson
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {currentLesson.title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed mt-2 whitespace-pre-line">
            {currentLesson.content}
          </p>

          <div className="mt-5 p-4 bg-amber-50/50 dark:bg-stone-950 border border-amber-200 dark:border-amber-900/40 rounded-xl">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Try This Exercise:
            </h4>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-normal">
              {currentLesson.instruction}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-3 justify-end items-center">
          <button
            onClick={() => currentLesson.abacusSetup && onApplyPreset(currentLesson.abacusSetup)}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 group transform active:scale-95"
          >
            Apply Preset to Abacus
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
