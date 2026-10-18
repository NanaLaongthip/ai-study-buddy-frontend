import React from 'react';
import { useStudyStore } from '../stores/useStudyStore';
import type { FlashcardItem } from '../services/api';
import { RotateCw, CheckCircle, HelpCircle, Tag } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardItem;
  index?: number;
  total?: number;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, index, total }) => {
  // Read flipped state directly from Zustand client state
  const isFlipped = useStudyStore((state) => state.flippedCards.includes(card.id));
  const toggleCardFlip = useStudyStore((state) => state.toggleCardFlip);

  // Extract optional [Category] tag from front text if present
  let categoryTag: string | null = null;
  let cleanQuestion = card.front;

  const match = card.front.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    categoryTag = match[1];
    cleanQuestion = match[2];
  }

  return (
    <div
      onClick={() => toggleCardFlip(card.id)}
      className="w-full max-w-xl mx-auto h-80 sm:h-96 [perspective:1000px] cursor-pointer select-none group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleCardFlip(card.id);
        }
      }}
      aria-label={`แฟลชการ์ดที่ ${index !== undefined ? index + 1 : ''}: คลิกเพื่อพลิกการ์ด`}
    >
      {/* 3D Flip Container */}
      <div
        className={`relative w-full h-full rounded-3xl transition-transform duration-500 ease-in-out [transform-style:preserve-3d] shadow-lg group-hover:shadow-xl ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT FACE (Question) */}
        <div className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-base-100 border-2 border-primary/20 hover:border-primary/50 [backface-visibility:hidden] transition-colors">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary badge-outline text-xs font-semibold gap-1.5 py-3 px-3">
                <HelpCircle className="w-3.5 h-3.5" />
                คำถาม {index !== undefined && total ? `${index + 1} / ${total}` : ''}
              </span>
              {categoryTag && (
                <span className="badge badge-secondary badge-sm font-medium gap-1">
                  <Tag className="w-3 h-3" />
                  {categoryTag}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-base-content/50 group-hover:text-primary transition-colors">
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">คลิกเพื่อดูคำตอบ</span>
            </div>
          </div>

          <div className="my-auto text-center px-4 overflow-y-auto max-h-56">
            <p className="text-lg sm:text-xl font-bold text-base-content leading-relaxed">
              {cleanQuestion}
            </p>
          </div>

          <div className="text-center text-[11px] text-base-content/40 tracking-wide uppercase">
            แฟลชการ์ดสุ่มคำถามจากเนื้อหา (Active Recall)
          </div>
        </div>

        {/* BACK FACE (Answer) */}
        <div className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-primary/10 border-2 border-primary [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex justify-between items-center">
            <span className="badge badge-success gap-1.5 text-white text-xs font-semibold py-3 px-3 shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              คำตอบ / คำอธิบาย
            </span>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">คลิกเพื่อดูโจทย์</span>
            </div>
          </div>

          <div className="my-auto text-center px-4 overflow-y-auto max-h-60">
            <p className="text-base sm:text-lg font-medium text-base-content leading-relaxed whitespace-pre-line text-left sm:text-center">
              {card.back}
            </p>
          </div>

          <div className="text-center text-[11px] text-primary/70 font-semibold tracking-wide uppercase">
            คลิกที่การ์ดเพื่อพลิกกลับ
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
