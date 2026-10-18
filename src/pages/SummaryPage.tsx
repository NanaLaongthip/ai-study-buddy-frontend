import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocumentData } from '../hooks/useDocumentData';
import { useStudyStore } from '../stores/useStudyStore';
import SummaryDashboard from '../components/SummaryDashboard';
import Flashcard from '../components/Flashcard';
import type { FlashcardItem } from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shuffle,
} from 'lucide-react';

export const SummaryPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary');

  // Server state via TanStack Query
  const { document, keyTakeaways, examFocus, flashcards, isLoading, isError, error, refetch } =
    useDocumentData(docId);

  // Local flashcard list for shuffling
  const [cards, setCards] = useState<FlashcardItem[]>([]);

  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setCards(flashcards);
    }
  }, [flashcards]);

  // Client state via Zustand
  const activeCardIndex = useStudyStore((state) => state.activeCardIndex);
  const nextCard = useStudyStore((state) => state.nextCard);
  const prevCard = useStudyStore((state) => state.prevCard);
  const resetFlippedCards = useStudyStore((state) => state.resetFlippedCards);
  const setActiveCardIndex = useStudyStore((state) => state.setActiveCardIndex);

  const handleShuffleCards = () => {
    if (cards.length <= 1) return;
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setActiveCardIndex(0);
    resetFlippedCards();
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="text-center">
          <h3 className="font-bold text-lg">กำลังดึงข้อมูลสื่อการเรียนรู้...</h3>
          <p className="text-xs text-base-content/60 mt-1">
            กำลังโหลดสรุปเนื้อหา จุดเน้นออกสอบ และแฟลชการ์ดภาษาไทย
          </p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError || !document) {
    return (
      <div className="max-w-xl mx-auto my-12 card bg-base-100 border border-error/30 shadow-lg p-8 text-center space-y-4 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-error mx-auto" />
        <h3 className="font-bold text-lg text-error">ไม่สามารถโหลดเอกสารได้</h3>
        <p className="text-xs text-base-content/70">
          {error?.message || 'ไม่พบเอกสารบทเรียนที่ต้องการ หรือยังประมวลผลไม่สมบูรณ์'}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/" className="btn btn-outline btn-sm">
            กลับหน้าหลัก
          </Link>
          <button onClick={() => refetch()} className="btn btn-primary btn-sm">
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  const currentFlashcard = cards[activeCardIndex] || cards[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link to="/" className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          หน้าหลัก
        </Link>

        {/* Tab switchers */}
        <div className="join bg-base-200 p-1 rounded-2xl shadow-inner self-center">
          <button
            onClick={() => setActiveTab('summary')}
            className={`join-item btn btn-sm rounded-xl font-semibold gap-2 ${
              activeTab === 'summary' ? 'btn-primary shadow-xs' : 'btn-ghost'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            สรุปเนื้อหาบทเรียน
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`join-item btn btn-sm rounded-xl font-semibold gap-2 ${
              activeTab === 'flashcards' ? 'btn-primary shadow-xs' : 'btn-ghost'
            }`}
          >
            <Brain className="w-4 h-4" />
            แฟลชการ์ด ({cards.length})
          </button>
        </div>

        <Link to={`/quiz/${docId}`} className="btn btn-secondary btn-sm gap-2 rounded-xl shadow-sm">
          <span>เริ่มทำแบบทดสอบ</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* VIEW 1: Summary Dashboard */}
      {activeTab === 'summary' && (
        <SummaryDashboard
          keyTakeaways={keyTakeaways}
          examFocus={examFocus}
          documentTitle={document.title}
          uploadDate={document.uploadDate}
        />
      )}

      {/* VIEW 2: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6 max-w-2xl mx-auto py-2">
          {cards.length === 0 ? (
            <div className="card bg-base-100 border border-base-300 p-8 text-center space-y-3 rounded-3xl">
              <HelpCircle className="w-10 h-10 text-base-content/30 mx-auto" />
              <h3 className="font-bold text-base">ไม่มีแฟลชการ์ดในเอกสารนี้</h3>
              <p className="text-xs text-base-content/60">
                เอกสารนี้ยังไม่มีชุดแฟลชการ์ดที่ถูกสร้างขึ้น
              </p>
            </div>
          ) : (
            <>
              {/* Flashcard Slider Header & Controls */}
              <div className="flex items-center justify-between text-xs text-base-content/70 px-2 bg-base-200/50 p-2.5 rounded-2xl border border-base-300/50">
                <span className="font-medium">
                  การ์ดที่ <strong className="text-primary font-bold">{activeCardIndex + 1}</strong> จาก {cards.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShuffleCards}
                    className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-secondary"
                    title="สุ่มลำดับคำถามใหม่"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-secondary" />
                    <span>สุ่มคำถาม</span>
                  </button>

                  <button
                    onClick={resetFlippedCards}
                    className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-primary"
                    title="คว่ำการ์ดทั้งหมดเพื่อเริ่มทบทวนใหม่"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>คว่ำการ์ด</span>
                  </button>
                </div>
              </div>

              {/* 3D Animated Flashcard */}
              {currentFlashcard && (
                <Flashcard
                  card={currentFlashcard}
                  index={activeCardIndex}
                  total={cards.length}
                />
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2 px-2">
                <button
                  onClick={prevCard}
                  disabled={activeCardIndex === 0}
                  className="btn btn-outline btn-sm gap-1.5 rounded-xl disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  ก่อนหน้า
                </button>

                <div className="flex gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs px-2 py-1 scrollbar-none">
                  {cards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveCardIndex(i);
                        resetFlippedCards();
                      }}
                      className={`h-2 rounded-full transition-all shrink-0 cursor-pointer ${
                        i === activeCardIndex ? 'w-6 bg-primary' : 'w-2 bg-base-300 hover:bg-base-content/30'
                      }`}
                      title={`ไปที่การ์ดที่ ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => nextCard(cards.length)}
                  className="btn btn-primary btn-sm gap-1.5 rounded-xl shadow-sm"
                >
                  ถัดไป
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
