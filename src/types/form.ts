import type{ JsonValue } from "@prisma/client/runtime/library";

export interface form {
    formId: string;
    formTitle: string;
    formData: JsonValue;  
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

type questionOption= string;

export interface questionDetail{
    questionId: string;
    questionText : string;
    questionType : string;
    options : questionOption[];
    linearStart : number;
    linearEnd : number;
    linearStartText: string;
    linearEndText: string;
    required : boolean;
}

export interface FormState{
    questions : questionDetail[];
}

