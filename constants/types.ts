
export type QuestionType= {
    question: string;
    options: string[];
    answer: string;
    level: string;
    _id: string;
}

export type genQuizType = {
    _id: string;
    completed: boolean;
    questions: QuestionType[];
    topicid: {
        _id: string;
        name: string;
    };
    totalPoints: number;
}

export type QuizScore = {
    questionId: string;
    selected: string;
}