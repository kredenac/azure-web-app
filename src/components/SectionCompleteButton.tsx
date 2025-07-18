import { useState } from 'react';
import { playCompletionSound } from '../utils/sound';

interface SectionCompleteButtonProps {
  sectionId: string;
  isCompleted: boolean;
  onToggleComplete: (sectionId: string) => void;
  className?: string;
}

export const SectionCompleteButton = ({
  sectionId,
  isCompleted,
  onToggleComplete,
  className = '',
}: SectionCompleteButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggleComplete(sectionId);

    // Play completion sound when marking as complete (not when uncompleting)
    if (!isCompleted) {
      playCompletionSound();
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
        ${
          isCompleted
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
        }
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      <div className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : ''}`}>
        {isCompleted ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      <span className="text-sm">{isCompleted ? 'Completed' : 'Mark Complete'}</span>

      {/* Celebration particles */}
      {isAnimating && isCompleted && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div
            className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>
      )}
    </button>
  );
};
