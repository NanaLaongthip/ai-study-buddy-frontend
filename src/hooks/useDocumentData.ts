import { useQuery } from '@tanstack/react-query';
import { fetchDocumentById } from '../services/api';
import type { StudyBundleResponse } from '../services/api';

/**
 * TanStack Query hook for fetching document study data by docId
 * Server State management: Caching, loading, error handling, and background revalidation
 * @param docId - The unique ID of the document
 */
export function useDocumentData(docId?: string) {
  const query = useQuery<StudyBundleResponse, Error>({
    queryKey: ['document', docId],
    queryFn: () => {
      if (!docId) {
        throw new Error('Document ID is required to fetch study materials.');
      }
      return fetchDocumentById(docId);
    },
    enabled: !!docId && docId.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
    retry: 2,
  });

  const bundle = query.data?.data;

  return {
    ...query,
    // Convenient shortcuts for components
    document: bundle?.document,
    summary: bundle?.summary,
    keyTakeaways: bundle?.summary?.key_takeaways || [],
    examFocus: bundle?.summary?.exam_focus || [],
    flashcards: bundle?.flashcards || [],
    quizQuestions: bundle?.quiz_questions || [],
  };
}

export default useDocumentData;
