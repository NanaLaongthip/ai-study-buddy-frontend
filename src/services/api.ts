/**
 * API client service for communicating with the backend
 */

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface DetailedTopicItem {
  topic: string;
  explanation: string;
  key_points?: string[];
}

export interface KeyTakeawaysData {
  overview?: string;
  detailed_topics?: DetailedTopicItem[];
  quick_bullets?: string[];
}

export interface DocumentSummary {
  id: string;
  key_takeaways: string[] | KeyTakeawaysData | any;
  exam_focus: string[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestionItem {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface StudyBundleResponse {
  success: boolean;
  message?: string;
  data: {
    document: {
      id: string;
      title: string;
      filename: string;
      uploadDate: string;
      numPages?: number;
    };
    summary: DocumentSummary;
    flashcards: FlashcardItem[];
    quiz_questions: QuizQuestionItem[];
  };
}

export interface QuizSubmissionResult {
  success: boolean;
  message?: string;
  data: {
    id: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    weakTopics: Array<{
      topic: string;
      recommendation: string;
    }>;
    recommendedStudyTopics: string[];
    missedQuestions: Array<{
      questionIndex: number;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }>;
  };
}

const API_BASE = '/api';

/**
 * Helper to get authorization headers
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('ai_study_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Register a new user
 */
export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'การสมัครสมาชิกล้มเหลว');
  }

  return data;
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'การเข้าสู่ระบบล้มเหลว');
  }

  return data;
}

/**
 * Get current user profile
 */
export async function fetchCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
  }

  return res.json();
}

/**
 * Upload a PDF file to the backend
 */
export async function uploadPdfFile(file: File, title?: string): Promise<StudyBundleResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'ไม่สามารถอัปโหลดไฟล์ PDF ได้ กรุณาลองใหม่อีกครั้ง');
  }

  return res.json();
}

/**
 * Fetch a document by its ID
 */
export async function fetchDocumentById(docId: string): Promise<StudyBundleResponse> {
  const res = await fetch(`${API_BASE}/documents/${docId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'ไม่สามารถดึงข้อมูลเอกสารได้');
  }
  return res.json();
}

/**
 * Fetch all documents for the logged-in user
 */
export async function fetchAllDocuments(): Promise<{
  success: boolean;
  data: Array<{
    id: string;
    title: string;
    filename: string;
    uploadDate: string;
    hasSummary: boolean;
    flashcardsCount: number;
  }>;
}> {
  const res = await fetch(`${API_BASE}/documents`, {
    headers: {
      ...getAuthHeaders(),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('ไม่สามารถโหลดรายการเอกสารได้');
  }
  return res.json();
}

/**
 * Delete a document by ID
 */
export async function deleteDocumentById(docId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/documents/${docId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'ไม่สามารถลบเอกสารได้');
  }
  return res.json();
}

/**
 * Submit quiz answers to the backend to calculate score and generate recommended study topics
 */
export async function submitQuizAnswers(
  docId: string,
  answers: Record<number, string>
): Promise<QuizSubmissionResult> {
  const res = await fetch(`${API_BASE}/documents/${docId}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ answers }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'ไม่สามารถส่งคำตอบแบบทดสอบได้');
  }

  return res.json();
}
