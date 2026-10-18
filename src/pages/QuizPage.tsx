import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocumentData } from '../hooks/useDocumentData';
import QuizInterface from '../components/QuizInterface';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();

  // Fetch document & quiz questions via TanStack Query hook
  const { document, quizQuestions, isLoading, isError, error, refetch } = useDocumentData(docId);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="text-center">
          <h3 className="font-bold text-lg">กำลังเตรียมแบบทดสอบ...</h3>
          <p className="text-xs text-base-content/60 mt-1">
            กำลังโหลดชุดคำถาม ตัวเลือก และเฉลยสำหรับเอกสารนี้
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
        <h3 className="font-bold text-lg text-error">ไม่สามารถโหลดแบบทดสอบได้</h3>
        <p className="text-xs text-base-content/70">
          {error?.message || 'ไม่พบชุดคำถามแบบทดสอบสำหรับเอกสารนี้'}
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/summary/${docId}`} className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปหน้าสรุป & แฟลชการ์ด</span>
        </Link>
        <span className="badge badge-primary badge-outline text-xs font-semibold py-2.5 px-3">
          {document.title}
        </span>
      </div>

      {/* Interactive Quiz Interface */}
      <QuizInterface
        docId={docId || ''}
        questions={quizQuestions}
        onRetake={() => refetch()}
      />
    </div>
  );
};

export default QuizPage;
