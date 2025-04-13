import { create } from 'zustand';
import { QuestionType } from '@/constants/types';

type Answer = {
  questionId: string; 
  selected: string;
  isCorrect: boolean;
};

type QuizState = {
  answers: Answer[];
  totalScore: number;
  submitAnswer: (question: QuestionType, selected: string) => void;
  resetQuiz: () => void;
};

export const useQuizStore = create<QuizState>((set, get) => ({
  answers: [],
  totalScore: 0,

  submitAnswer: (question, selected) => {
    const existing = get().answers.find(a => a.questionId === question._id);
    if (existing) return; // Prevent resubmitting

    const isCorrect = selected.trim() === question.answer.trim();

    set(state => ({
      answers: [
        ...state.answers,
        {
          questionId: question._id,
          selected,
          isCorrect,
        },
      ],
      totalScore: isCorrect ? state.totalScore + 1 : state.totalScore,
    }));
  },

  resetQuiz: () => set({ answers: [], totalScore: 0 }),
}));
