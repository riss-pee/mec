import React from 'react';
import { DiagnosticFeedback } from '../types/game';
import { AlertTriangle, CheckCircle2, Compass, Crosshair, ArrowRightLeft, Info, X } from 'lucide-react';

interface DiagnosticBannerProps {
  diagnostic: DiagnosticFeedback | null;
  onDismiss: () => void;
  isProjector?: boolean;
  theme?: string;
}

export const DiagnosticBanner: React.FC<DiagnosticBannerProps> = ({
  diagnostic,
  onDismiss,
  isProjector: isProjectorProp,
  theme,
}) => {
  if (!diagnostic) return null;
  const isProjector = isProjectorProp ?? theme !== 'tactical';

  const getStyleAndIcon = () => {
    switch (diagnostic.type) {
      case 'hit':
      case 'linear_pierce':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          borderColor: isProjector ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-500/40 bg-emerald-950/80',
          titleColor: isProjector ? 'text-emerald-900' : 'text-emerald-300',
          textColor: isProjector ? 'text-emerald-800' : 'text-emerald-200',
          badgeText: diagnostic.calculatedAim
            ? diagnostic.type === 'linear_pierce'
              ? 'MULTI-HIT PIERCE (2× CALCULATED AIM)'
              : '2× CALCULATED AIM HIT!'
            : diagnostic.type === 'linear_pierce'
            ? 'MULTI-HIT PIERCE'
            : 'TARGET NEUTRALIZED',
          badgeBg: diagnostic.calculatedAim
            ? isProjector
              ? 'bg-amber-100 text-amber-900 font-extrabold border border-amber-300'
              : 'bg-amber-950/90 text-amber-300 font-extrabold border border-amber-700'
            : isProjector
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-emerald-900/60 text-emerald-300',
        };
      case 'inverted':
        return {
          icon: <ArrowRightLeft className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />,
          borderColor: isProjector ? 'border-amber-500 bg-amber-50' : 'border-amber-500/50 bg-amber-950/80',
          titleColor: isProjector ? 'text-amber-900' : 'text-amber-300',
          textColor: isProjector ? 'text-amber-800' : 'text-amber-200',
          badgeText: 'COMMON MISTAKE DETECTED',
          badgeBg: isProjector ? 'bg-amber-100 text-amber-800' : 'bg-amber-900/60 text-amber-300',
        };
      case 'quadrant_sign':
        return {
          icon: <Compass className="w-5 h-5 text-sky-500 shrink-0" />,
          borderColor: isProjector ? 'border-sky-500 bg-sky-50' : 'border-sky-500/40 bg-sky-950/80',
          titleColor: isProjector ? 'text-sky-900' : 'text-sky-300',
          textColor: isProjector ? 'text-sky-800' : 'text-sky-200',
          badgeText: 'QUADRANT SIGN COACHING',
          badgeBg: isProjector ? 'bg-sky-100 text-sky-800' : 'bg-sky-900/60 text-sky-300',
        };
      case 'close_miss':
        return {
          icon: <Crosshair className="w-5 h-5 text-amber-500 shrink-0" />,
          borderColor: isProjector ? 'border-amber-400 bg-amber-50' : 'border-amber-500/30 bg-slate-900/90',
          titleColor: isProjector ? 'text-amber-900' : 'text-amber-300',
          textColor: isProjector ? 'text-slate-800' : 'text-slate-300',
          badgeText: 'CLOSE SHOT',
          badgeBg: isProjector ? 'bg-amber-100 text-amber-800' : 'bg-slate-800 text-amber-300',
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-slate-400 shrink-0" />,
          borderColor: isProjector ? 'border-slate-300 bg-slate-100' : 'border-slate-700 bg-slate-900/90',
          titleColor: isProjector ? 'text-slate-900' : 'text-slate-200',
          textColor: isProjector ? 'text-slate-700' : 'text-slate-400',
          badgeText: 'DIAGNOSTIC RADAR',
          badgeBg: isProjector ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300',
        };
    }
  };

  const style = getStyleAndIcon();

  return (
    <div
      className={`border rounded-lg p-3.5 shadow-lg transition-all backdrop-blur-md ${style.borderColor}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {style.icon}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded tracking-wider ${style.badgeBg}`}>
                {style.badgeText}
              </span>
              <h4 className={`text-base font-bold ${style.titleColor}`}>
                {diagnostic.title}
              </h4>
            </div>

            <p className={`text-sm leading-relaxed ${style.textColor}`}>
              {diagnostic.message}
            </p>

            {/* Line Equation & Roots/Zeroes Telemetry Box */}
            {(diagnostic.equationStr || diagnostic.rootsInfo) && (
              <div className={`mt-2.5 p-2.5 rounded-lg border font-mono text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${
                isProjector
                  ? 'bg-white/95 border-slate-200 text-slate-800 shadow-2xs'
                  : 'bg-slate-950/70 border-slate-700/60 text-slate-200'
              }`}>
                {diagnostic.equationStr && (
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-slate-500 font-sans text-xs font-semibold shrink-0">Line Equation:</span>
                    <span className={`px-2 py-0.5 rounded border font-bold text-xs sm:text-sm truncate ${
                      isProjector ? 'bg-sky-50 border-sky-200 text-sky-800' : 'bg-sky-950/80 border-sky-700/60 text-sky-300'
                    }`}>
                      {diagnostic.equationStr}
                    </span>
                  </div>
                )}

                {diagnostic.rootsInfo && (
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-slate-500 font-sans text-xs font-semibold shrink-0">Root / Zero (y=0):</span>
                    <span className={`px-2 py-0.5 rounded border font-bold text-xs sm:text-sm truncate ${
                      isProjector ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/80 border-amber-700/60 text-amber-300'
                    }`}>
                      {diagnostic.rootsInfo.rootStr}
                    </span>
                  </div>
                )}

                {diagnostic.cannonPos && (diagnostic.cannonPos.x !== 0 || diagnostic.cannonPos.y !== 0) && (
                  <div className={`col-span-1 sm:col-span-2 flex items-center gap-2 text-xs font-sans border-t pt-1.5 ${
                    isProjector ? 'border-slate-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
                  }`}>
                    <span>Battery Origin: <strong className="font-mono text-emerald-600 font-bold">({diagnostic.cannonPos.x}, {diagnostic.cannonPos.y})</strong></span>
                    {diagnostic.rootsInfo?.yInterceptStr && (
                      <span>• Y-Intercept (x=0): <strong className="font-mono text-purple-600 font-bold">{diagnostic.rootsInfo.yInterceptStr}</strong></span>
                    )}
                  </div>
                )}
              </div>
            )}

            {diagnostic.pedagogicalTip && (
              <div className="mt-2.5 flex items-start gap-1.5 text-xs sm:text-sm font-medium">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-sky-500" />
                <span className={isProjector ? 'text-slate-900' : 'text-slate-200'}>
                  <strong>Teacher Tip:</strong> {diagnostic.pedagogicalTip}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          title="Dismiss notification"
          aria-label="Dismiss diagnostic message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
