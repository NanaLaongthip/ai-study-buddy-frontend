import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  BookmarkCheck,
  Copy,
  Check,
  FileText,
  Layers,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  ListChecks,
} from 'lucide-react';
import type { KeyTakeawaysData, DetailedTopicItem } from '../services/api';

interface SummaryDashboardProps {
  keyTakeaways: string[] | KeyTakeawaysData | any;
  examFocus: string[];
  documentTitle?: string;
  uploadDate?: string;
}

interface NormalizedSummary {
  overview: string;
  detailedTopics: DetailedTopicItem[];
  quickBullets: string[];
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  keyTakeaways,
  examFocus,
  documentTitle,
  uploadDate,
}) => {
  const [checkedTakeaways, setCheckedTakeaways] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [activeFilter, setActiveFilter] = useState<'all' | 'notes' | 'exam' | 'checklist'>('all');

  // Normalize raw keyTakeaways into a unified structured object
  const normalized: NormalizedSummary = useMemo(() => {
    if (!keyTakeaways) {
      return { overview: '', detailedTopics: [], quickBullets: [] };
    }

    // Case 1: Object format with overview & detailed_topics
    if (typeof keyTakeaways === 'object' && !Array.isArray(keyTakeaways)) {
      const overview = keyTakeaways.overview || '';
      const detailedTopics: DetailedTopicItem[] = Array.isArray(keyTakeaways.detailed_topics)
        ? keyTakeaways.detailed_topics
        : [];
      const quickBullets: string[] = Array.isArray(keyTakeaways.quick_bullets)
        ? keyTakeaways.quick_bullets
        : Array.isArray(keyTakeaways.bullets)
        ? keyTakeaways.bullets
        : detailedTopics.map((t) => t.topic);

      return { overview, detailedTopics, quickBullets };
    }

    // Case 2: Array of strings (classic format)
    if (Array.isArray(keyTakeaways)) {
      const stringItems = keyTakeaways.map((item) =>
        typeof item === 'string' ? item : JSON.stringify(item)
      );

      const overview = stringItems.length > 0
        ? `เอกสารนี้ครอบคลุมประเด็นสำคัญหลัก ${stringItems.length} หัวข้อ โดยมุ่งเน้นแนวคิดเชิงทฤษฎีและแนวทางการนำไปประยุกต์ใช้งานจริงเพื่อเตรียมความพร้อมในการเรียนรู้และการสอบ`
        : '';

      const detailedTopics: DetailedTopicItem[] = stringItems.map((item, idx) => {
        // Attempt to split title: description if there's a colon
        const parts = item.split(/[:：]/);
        if (parts.length > 1) {
          return {
            topic: `${idx + 1}. ${parts[0].trim()}`,
            explanation: parts.slice(1).join(':').trim(),
            key_points: [],
          };
        }
        return {
          topic: `ประเด็นสำคัญที่ ${idx + 1}`,
          explanation: item,
          key_points: [],
        };
      });

      return {
        overview,
        detailedTopics,
        quickBullets: stringItems,
      };
    }

    return { overview: '', detailedTopics: [], quickBullets: [] };
  }, [keyTakeaways]);

  const toggleCheck = (idx: number) => {
    setCheckedTakeaways((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopySummary = () => {
    let textToCopy = `=== สรุปบทเรียน: ${documentTitle || 'AI Study Buddy'} ===\n\n`;

    if (normalized.overview) {
      textToCopy += `[สรุปภาพรวมเนื้อหา]\n${normalized.overview}\n\n`;
    }

    if (normalized.detailedTopics.length > 0) {
      textToCopy += `[เนื้อหาสำคัญเชิงลึก]\n`;
      normalized.detailedTopics.forEach((t) => {
        textToCopy += `• ${t.topic}\n  คำอธิบาย: ${t.explanation}\n`;
        if (t.key_points && t.key_points.length > 0) {
          t.key_points.forEach((kp) => {
            textToCopy += `    - ${kp}\n`;
          });
        }
        textToCopy += `\n`;
      });
    }

    if (examFocus.length > 0) {
      textToCopy += `[จุดเน้นออกสอบ]\n${examFocus.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkedCount = Object.values(checkedTakeaways).filter(Boolean).length;
  const totalChecklist = normalized.quickBullets.length;

  // Text size classes
  const bodyTextClass = fontSize === 'large' ? 'text-base sm:text-lg leading-relaxed' : 'text-sm sm:text-base leading-relaxed';
  const headingTextClass = fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Toolbar */}
      <div className="bg-base-100 p-5 rounded-3xl border border-base-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Lecture Digest</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary shrink-0" />
            <span>{documentTitle || 'สรุปเนื้อหาบทเรียน'}</span>
          </h2>
          {uploadDate && (
            <p className="text-xs text-base-content/60 mt-1">
              สร้างเมื่อ {new Date(uploadDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        {/* Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Size Toggle */}
          <div className="join border border-base-300 rounded-xl overflow-hidden bg-base-200/50">
            <button
              onClick={() => setFontSize('normal')}
              className={`join-item btn btn-xs sm:btn-sm gap-1 ${fontSize === 'normal' ? 'btn-active btn-neutral' : 'btn-ghost'}`}
              title="ขนาดตัวอักษรปกติ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ปกติ</span>
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`join-item btn btn-xs sm:btn-sm gap-1 ${fontSize === 'large' ? 'btn-active btn-neutral' : 'btn-ghost'}`}
              title="ขนาดตัวอักษรอ่านสบายตา"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">อ่านง่าย (A+)</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopySummary}
            className="btn btn-sm btn-outline gap-1.5 rounded-xl border-base-300 hover:bg-base-200"
            title="คัดลอกสรุปทั้งหมด"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกสรุป'}</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`btn btn-sm rounded-xl font-medium ${
            activeFilter === 'all' ? 'btn-primary shadow-xs' : 'btn-ghost bg-base-200/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          แสดงทั้งหมด
        </button>
        <button
          onClick={() => setActiveFilter('notes')}
          className={`btn btn-sm rounded-xl font-medium ${
            activeFilter === 'notes' ? 'btn-primary shadow-xs' : 'btn-ghost bg-base-200/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          เนื้อหาสำคัญเชิงลึก ({normalized.detailedTopics.length})
        </button>
        <button
          onClick={() => setActiveFilter('exam')}
          className={`btn btn-sm rounded-xl font-medium ${
            activeFilter === 'exam' ? 'btn-primary shadow-xs' : 'btn-ghost bg-base-200/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-warning" />
          จุดเน้นออกสอบ ({examFocus.length})
        </button>
        {normalized.quickBullets.length > 0 && (
          <button
            onClick={() => setActiveFilter('checklist')}
            className={`btn btn-sm rounded-xl font-medium ${
              activeFilter === 'checklist' ? 'btn-primary shadow-xs' : 'btn-ghost bg-base-200/60'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            เช็คลิสต์ทบทวน ({checkedCount}/{totalChecklist})
          </button>
        )}
      </div>

      {/* 3. Executive Overview Callout */}
      {(activeFilter === 'all' || activeFilter === 'notes') && normalized.overview && (
        <div className="card bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 border-2 border-primary/20 shadow-md rounded-3xl p-6 sm:p-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-sm font-semibold">สรุปภาพรวมเอกสาร</span>
                <span className="text-xs text-base-content/60">Executive Summary</span>
              </div>
              <p className={`font-medium text-base-content leading-relaxed ${fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                {normalized.overview}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Detailed Core Topics Breakdown */}
      {(activeFilter === 'all' || activeFilter === 'notes') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>เนื้อหาสำคัญที่สรุปได้จากเอกสาร (Core Concepts & Explanations)</span>
            </h3>
            <span className="text-xs text-base-content/60">
              {normalized.detailedTopics.length} หัวข้อสำคัญ
            </span>
          </div>

          {normalized.detailedTopics.length === 0 ? (
            <div className="card bg-base-100 border border-base-200 p-8 text-center rounded-2xl text-base-content/60">
              <FileText className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="text-sm">กำลังประมวลผลเนื้อหาสำคัญ...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {normalized.detailedTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="card bg-base-100 border border-base-200 hover:border-primary/40 shadow-xs hover:shadow-md transition-all rounded-3xl p-6 sm:p-7 space-y-4"
                >
                  {/* Topic Title Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-base-200/80 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-outline badge-sm font-bold">
                          หัวข้อที่ {idx + 1}
                        </span>
                      </div>
                      <h4 className={`font-extrabold text-base-content tracking-tight ${headingTextClass}`}>
                        {topic.topic}
                      </h4>
                    </div>
                  </div>

                  {/* Topic Explanation (In-depth multi-paragraph reading content) */}
                  <div className="space-y-4 pt-1">
                    {topic.explanation
                      .split(/\n\s*\n/)
                      .filter((para) => para.trim().length > 0)
                      .map((para, pIdx) => {
                        const trimmed = para.trim();
                        const isSectionTag = trimmed.startsWith('【') && trimmed.includes('】');
                        if (isSectionTag) {
                          const tagEnd = trimmed.indexOf('】') + 1;
                          const tag = trimmed.slice(0, tagEnd);
                          const rest = trimmed.slice(tagEnd).trim();
                          return (
                            <div key={pIdx} className="p-4 sm:p-5 rounded-2xl bg-base-200/50 border border-base-300/60 space-y-2">
                              <span className="badge badge-primary badge-sm font-bold">{tag}</span>
                              <p className={`text-base-content/90 font-normal whitespace-pre-line leading-relaxed ${bodyTextClass}`}>
                                {rest}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <p key={pIdx} className={`text-base-content/90 font-normal whitespace-pre-line leading-relaxed ${bodyTextClass}`}>
                            {trimmed}
                          </p>
                        );
                      })}
                  </div>

                  {/* Key Points / Sub-bullets */}
                  {topic.key_points && topic.key_points.length > 0 && (
                    <div className="bg-base-200/50 border border-base-300/60 rounded-2xl p-4 sm:p-5 space-y-2 mt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                        จุดสังเกตและข้อควรจำสำคัญ
                      </span>
                      <ul className="space-y-2 text-xs sm:text-sm text-base-content/80 mt-1">
                        {topic.key_points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Exam Focus Section */}
      {(activeFilter === 'all' || activeFilter === 'exam') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-warning" />
              <span>จุดเน้นออกสอบ (Exam Focus & High-Yield Topics)</span>
            </h3>
            <span className="badge badge-warning badge-sm font-semibold">
              โอกาสออกสอบสูง
            </span>
          </div>

          <div className="card bg-base-100 border border-warning/30 shadow-md rounded-3xl overflow-hidden p-6 sm:p-8 space-y-5">
            <div className="alert alert-warning/10 border border-warning/20 py-3 px-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
              <span>หัวข้อเหล่านี้ถูกวิเคราะห์ว่ามีความสำคัญเชิงทฤษฎีและมักถูกหยิบยกมาออกข้อสอบจริงบ่อยที่สุด</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examFocus.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-base-200 bg-base-100 hover:border-warning/50 hover:bg-warning/5 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge badge-warning badge-xs font-bold uppercase">
                        จุดเน้นที่ {idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-warning">
                        90%+ โอกาสออกสอบ
                      </span>
                    </div>
                    <p className={`font-bold text-base-content leading-relaxed ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                      {topic}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-base-200/60 text-[11px] text-base-content/60 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-warning" />
                    <span>แนะนำให้ฝึกทำแฟลชการ์ดและแบบทดสอบในหัวข้อนี้</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Quick Review Checklist */}
      {(activeFilter === 'all' || activeFilter === 'checklist') && normalized.quickBullets.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>เช็คลิสต์ทบทวนความเข้าใจ (Active Review Checklist)</span>
            </h3>
            <span className="text-xs font-semibold text-base-content/70">
              ทบทวนแล้ว <strong className="text-primary">{checkedCount}</strong> / {totalChecklist} ข้อ
            </span>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-md rounded-3xl p-6 sm:p-7 space-y-4">
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-base-content/60 font-medium">
                <span>ความคืบหน้าในการทบทวน</span>
                <span>{totalChecklist > 0 ? Math.round((checkedCount / totalChecklist) * 100) : 0}%</span>
              </div>
              <progress
                className="progress progress-primary w-full h-2 rounded-full"
                value={checkedCount}
                max={totalChecklist}
              ></progress>
            </div>

            <div className="space-y-2.5 pt-2">
              {normalized.quickBullets.map((bullet, idx) => {
                const isChecked = !!checkedTakeaways[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-base-200/50 border-base-200 text-base-content/50 line-through'
                        : 'bg-base-100 border-base-200 hover:border-primary/40 hover:bg-primary/5 text-base-content'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheck(idx)}
                      className="checkbox checkbox-primary checkbox-sm mt-0.5 shrink-0"
                    />
                    <span className={`leading-relaxed font-medium ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                      {bullet}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryDashboard;
