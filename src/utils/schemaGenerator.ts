import { FormState, questionDetail } from '@/types/form';
import * as z from 'zod';

export const createDynamicZodSchema = (formState: FormState): z.ZodTypeAny => {
    let schemaObject: { [key: string]: z.ZodTypeAny } = {};

    formState.questions.forEach((question: questionDetail) => {
        switch (question.questionType) {
            case 'shortAnswer':
            case 'paragraph':
                if(question.required){
                    schemaObject[question.questionId] = z.string().min(1,{ message: "This field cannot be empty." });
                }
                break;
            case 'multipleChoice':
                if(question.required){
                    if (question.options && question.options.length > 0 ) {
                        const optionsTuple: [string, ...string[]] = [question.options[0] as string, ...question.options.slice(1)];
                        schemaObject[question.questionId] = z.enum(optionsTuple);
                    } else {
                        schemaObject[question.questionId] = z.string();
                    }
                }
                break;
            case 'checkbox':
                if(question.required){
                    if (question.options && question.options.length > 0) {
                        const optionsTuple: [string, ...string[]] = [question.options[0] as string, ...question.options.slice(1)];
                        schemaObject[question.questionId] = z.array(z.enum(optionsTuple)).min(1, { message: "At least one option must be selected." });
                    } else {
                        schemaObject[question.questionId] = z.array(z.string());
                    }
                }
                break;
            case 'Date':
                if(question.required){
                    schemaObject[question.questionId] = z.string().refine(val => !isNaN(Date.parse(val)), { message: "Please enter a valid date." });
                }
                break;
            case 'Time':
                if(question.required){
                    schemaObject[question.questionId] = z.string();
                }
                break;
        }
    });

    return z.object(schemaObject);
};
