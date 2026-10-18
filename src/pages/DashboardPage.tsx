import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { uploadPdfFile, fetchAllDocuments, deleteDocumentById } from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';
import {
  UploadCloud,
  FileText,
  Sparkles,
  Brain,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
  Trash2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuthStore();

  // TanStack Query for user's documents (scoped to user.id so switching accounts clears list immediately)
  const { data: documentsData, refetch: refetchDocs, isLoading: isLoadingDocs } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: fetchAllDocuments,
    staleTime: 0, // Always fetch latest for the current account
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setUploadError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('กรุณาเลือกไฟล์ PDF ที่ต้องการอัปโหลด');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await uploadPdfFile(selectedFile, docTitle.trim() || undefined);
      refetchDocs();
      navigate(`/summary/${result.data.document.id}`);
    } catch (err) {
      const error = err as Error;
      setUploadError(error.message || 'เกิดข้อผิดพลาดในการอัปโหลดและวิเคราะห์ไฟล์ PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string, docTitle: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร "${docTitle}"?`)) {
      return;
    }

    try {
      setDeletingId(docId);
      await deleteDocumentById(docId);
      refetchDocs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'ไม่สามารถลบเอกสารได้');
    } finally {
      setDeletingId(null);
    }
  };

  const documents = documentsData?.data || [];

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>ผู้ช่วยติวหนังสือและสรุปบทเรียนด้วย AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          ยกระดับการเรียนและเตรียมสอบด้วย <span className="text-primary">AI Study Buddy</span>
        </h1>
        <p className="text-base-content/70 max-w-2xl mx-auto text-sm sm:text-base">
          อัปโหลดไฟล์สไลด์ PDF เพื่อรับสรุปประเด็นสำคัญ จุดเน้นออกสอบ แฟลชการ์ดช่วยจำ และแบบทดสอบวัดความเข้าใจเป็นภาษาไทยได้ในไม่กี่วินาที
        </p>
      </div>

      {/* Upload Dropzone Card */}
      <form onSubmit={handleUpload} className="card bg-base-100 shadow-xl border-2 border-dashed border-base-300 hover:border-primary/50 transition-all rounded-3xl overflow-hidden">
        <div className="card-body items-center text-center p-8 sm:p-12 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold">อัปโหลดไฟล์สไลด์บทเรียน (PDF)</h3>
            <p className="text-xs text-base-content/60 mt-1">
              เลือกไฟล์สไลด์การสอน เพื่อให้ AI เริ่มต้นวิเคราะห์และสร้างสื่อการเรียนรู้ภาษาไทย
            </p>
          </div>

          <div className="w-full max-w-md space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="file-input file-input-bordered file-input-primary w-full"
            />

            {selectedFile && (
              <input
                type="text"
                placeholder="ตั้งชื่อเอกสาร (หรือใช้ชื่อเดิมตามไฟล์)"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                disabled={isUploading}
                className="input input-bordered input-sm w-full"
              />
            )}

            {uploadError && (
              <div className="alert alert-error text-xs py-2.5 rounded-xl text-left flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="btn btn-primary w-full gap-2 rounded-xl shadow-md"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังวิเคราะห์และสังเคราะห์เนื้อหาภาษาไทยด้วย AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  เริ่มวิเคราะห์ด้วย AI
                </>
              )}
            </button>
          </div>

          <span className="text-[11px] text-base-content/50">
            รองรับไฟล์เอกสาร PDF ขนาดสูงสุดไม่เกิน 50MB
          </span>
        </div>
      </form>

      {/* Processed Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            คลังเอกสารและบทเรียนของคุณ
          </h3>
          <span className="text-xs text-base-content/60">
            {documents.length} รายการ
          </span>
        </div>

        {isLoadingDocs ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <p className="text-xs text-base-content/60 mt-2">กำลังโหลดรายการเอกสาร...</p>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="card bg-base-100 border border-base-200 hover:border-primary/40 shadow-xs hover:shadow-md transition-all rounded-2xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-base line-clamp-1">{doc.title}</h4>
                    <span className="badge badge-primary badge-sm">
                      {doc.flashcardsCount} แฟลชการ์ด
                    </span>
                  </div>
                  <p className="text-xs text-base-content/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    อัปโหลดเมื่อ {new Date(doc.uploadDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 mt-2 border-t border-base-200">
                  <Link
                    to={`/summary/${doc.id}`}
                    className="btn btn-primary btn-sm flex-1 gap-1.5 rounded-lg"
                  >
                    <span>ดูสรุป & แฟลชการ์ด</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/quiz/${doc.id}`}
                    className="btn btn-secondary btn-outline btn-sm rounded-lg"
                  >
                    ทำควิซ
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    disabled={deletingId === doc.id}
                    className="btn btn-ghost btn-sm text-error btn-square rounded-lg"
                    title="ลบเอกสารนี้"
                  >
                    {deletingId === doc.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-base-100 border border-base-200 p-8 text-center rounded-2xl text-base-content/60">
            <FileText className="w-10 h-10 mx-auto opacity-30 mb-2" />
            <p className="text-sm font-medium">ยังไม่มีเอกสารในบัญชีของคุณ</p>
            <p className="text-xs mt-1">อัปโหลดไฟล์ PDF ด้านบนเพื่อเริ่มสร้างสรุปและแฟลชการ์ดชุดแรกของคุณ</p>
          </div>
        )}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="card bg-base-200/50 border border-base-300 p-5 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base">สรุปประเด็นสำคัญ (Key Takeaways)</h4>
          <p className="text-xs text-base-content/70">
            AI สกัดใจความสำคัญและหลักการสำคัญจากสไลด์ให้อัตโนมัติ เพื่อการทบทวนที่รวดเร็วและตรงจุด
          </p>
        </div>

        <div className="card bg-base-200/50 border border-base-300 p-5 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base">แฟลชการ์ดช่วยจำ (Flashcards)</h4>
          <p className="text-xs text-base-content/70">
            ฝึกฝนความจำด้วยการ์ดคำถาม-คำตอบแบบพลิกการ์ดได้จริง เพิ่มประสิทธิภาพการจดจำระยะยาว
          </p>
        </div>

        <div className="card bg-base-200/50 border border-base-300 p-5 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base">แบบทดสอบ & วิเคราะห์จุดอ่อน (Quizzes)</h4>
          <p className="text-xs text-base-content/70">
            ทดสอบความรู้ด้วยแบบฝึกหัดปรนัย พร้อมตรวจคำตอบและชี้จุดที่ควรทบทวนเพิ่มเติมทันที
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
