export type Answer = {
    questionId: string;
    value: string | string[];
}
export interface AnswerObj {
    answerId: string;
    answerData: Answer[];
    formId: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export interface CloudinaryUploadResult {
    info?: {
        secure_url?: string;
    };
}