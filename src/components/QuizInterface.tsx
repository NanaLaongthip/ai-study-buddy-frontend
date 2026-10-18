import React, { useState } from 'react';
import { submitQuizAnswers } from '../services/api';
import type { QuizQuestionItem, QuizSubmissionResult } from '../services/api';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Send,
  Loader2,
} from 'lucide-react';

interface QuizInterfaceProps {
  docId: string;
  questions: QuizQuestionItem[];
  onRetake?: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ docId, questions, onRetake }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizSubmissionResult['data'] | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-300 p-8 text-center space-y-4 max-w-xl mx-auto rounded-3xl">
        <HelpCircle className="w-12 h-12 text-base-content/30 mx-auto" />
        <h3 className="text-lg font-bold">ไม่มีแบบทดสอบในเอกสารนี้</h3>
        <p className="text-xs text-base-content/60">
          เอกสารนี้ยังไม่มีชุดคำถามแบบทดสอบที่สร้างขึ้น
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitQuizAnswers(docId, answers);
      setResult(response.data);
    } catch (err) {
      const error = err as Error;
      setSubmitError(error.message || 'เกิดข้อผิดพลาดในการส่งคำตอบแบบทดสอบ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setSubmitError(null);
    if (onRetake) onRetake();
  };

  // --- RESULT VIEW ---
  if (result) {
    const isHighPassing = result.percentage >= 80;
    const isPassing = result.percentage >= 50;

    return (
      <div className="max-w-3xl mx-auto space-y-8 py-2">
        {/* Score Banner */}
        <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 text-center space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-base-100 shadow-md">
              <Award className={`w-12 h-12 ${isHighPassing ? 'text-warning' : isPassing ? 'text-primary' : 'text-error'}`} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-base-content/60">
                ผลการประเมินแบบทดสอบ
              </span>
              <h2 className="text-3xl font-extrabold mt-1">
                คะแนนที่ได้: {result.score} / {result.totalQuestions} ({result.percentage}%)
              </h2>
            </div>

            <div className="flex justify-center gap-2">
              <span
                className={`badge badge-lg font-bold px-4 py-3 ${
                  isHighPassing
                    ? 'badge-success text-white'
                    : isPassing
                    ? 'badge-primary text-white'
                    : 'badge-error text-white'
                }`}
              >
                {isHighPassing ? 'ยอดเยี่ยมมาก! เข้าใจเนื้อหาได้อย่างแม่นยำ 🏆' : isPassing ? 'ทำได้ดี! ทบทวนเพิ่มเติมอีกนิดเพื่อคะแนนเต็ม' : 'ควรกลับไปทบทวนเนื้อหาเพิ่มเติม'}
              </span>
            </div>
          </div>

          <div className="card-body p-6 sm:p-8 space-y-6">
            {/* RECOMMENDED STUDY TOPICS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Sparkles className="w-5 h-5 text-warning" />
                <h3>หัวข้อที่แนะนำให้ทบทวนเพิ่มเติม (วิเคราะห์จากข้อที่ตอบผิด)</h3>
              </div>

              <div className="space-y-2.5">
                {result.recommendedStudyTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-warning/30 bg-warning/5 text-sm font-medium flex items-start gap-2.5"
                  >
                    <BookOpen className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4 pt-4 border-t border-base-200">
              <h4 className="font-bold text-sm text-base-content/70 uppercase tracking-wider">
                เฉลยและตรวจทานคำตอบรายข้อ
              </h4>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'border-success/30 bg-success/5'
                          : 'border-error/30 bg-error/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-sm">
                          ข้อที่ {idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="badge badge-success badge-sm gap-1 text-white shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ถูกต้อง
                          </span>
                        ) : (
                          <span className="badge badge-error badge-sm gap-1 text-white shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> ไม่ถูกต้อง
                          </span>
                        )}
                      </div>

                      <div className="mt-3 text-xs space-y-1">
                        <p>
                          <span className="font-semibold text-base-content/70">คำตอบของคุณ: </span>
                          <span className={isCorrect ? 'text-success font-medium' : 'text-error font-medium'}>
                            {userAnswer || 'ไม่ได้ตอบคำถาม'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="font-semibold text-base-content/70">คำตอบที่ถูกต้อง: </span>
                            <span className="text-success font-medium">{q.answer}</span>
                          </p>
                        )}
                        {q.explanation && (
                          <p className="text-base-content/60 pt-1 italic">
                            คำอธิบาย: {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-4">
              <button onClick={handleReset} className="btn btn-primary gap-2 rounded-xl px-8 shadow-md">
                <RotateCcw className="w-4 h-4" />
                ทำแบบทดสอบใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ VIEW ---
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      {/* Progress header */}
      <div className="flex items-center justify-between text-xs text-base-content/70">
        <span className="font-semibold">
          ข้อที่ {currentIndex + 1} จาก {total}
        </span>
        <span>
          ตอบแล้ว: <strong className="text-primary">{answeredCount}</strong> / {total}
        </span>
      </div>

      <progress
        className="progress progress-primary w-full h-2"
        value={currentIndex + 1}
        max={total}
      ></progress>

      {/* Question Card */}
      <div className="card bg-base-100 border border-base-300 shadow-md rounded-3xl overflow-hidden">
        <div className="card-body p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-primary">
              คำถามข้อที่ {currentIndex + 1}
            </span>
            <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-base-content">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentIndex] === option;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                      : 'border-base-200 hover:border-primary/40 hover:bg-base-200/50 text-base-content'
                  }`}
                >
                  <input
                    type="radio"
                    name={`quiz-option-${currentIndex}`}
                    checked={isSelected}
                    onChange={() => handleSelectOption(option)}
                    className="radio radio-primary radio-sm"
                  />
                  <span className="text-sm select-none leading-relaxed">{option}</span>
                </div>
              );
            })}
          </div>

          {submitError && (
            <div className="alert alert-error text-xs py-2.5 rounded-xl">
              <span>{submitError}</span>
            </div>
          )}

          {/* Navigation & Submit footer */}
          <div className="flex items-center justify-between pt-4 border-t border-base-200 gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="btn btn-ghost btn-sm gap-1.5 rounded-lg disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              ข้อก่อนหน้า
            </button>

            {currentIndex < total - 1 ? (
              <button
                onClick={handleNext}
                className="btn btn-primary btn-sm gap-1.5 rounded-lg px-5 shadow-xs"
              >
                ข้อถัดไป
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount === 0}
                className="btn btn-success text-white btn-sm gap-2 rounded-lg px-6 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังตรวจคำตอบ...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    ส่งคำตอบ & ประเมินผล
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
