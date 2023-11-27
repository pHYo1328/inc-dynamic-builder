import { FormState, questionDetail } from '@/types/form';
import * as z from 'zod';

export const createDynamicZodSchema = (formState: FormState): z.ZodTypeAny => {
    let schemaObject: { [key: string]: z.ZodTypeAny } = {};

    formState.questions.forEach((question: questionDetail) => {
        switch (question.questionType) {
            case 'shortAnswer':
            case 'paragraph':
                if (question.required) {
                    schemaObject[question.questionId] = z.string().min(1, { message: "This field cannot be empty." });
                }
                break;
            case 'multipleChoice':
                if (question.required) {
                    if (question.options && question.options.length > 0) {
                        const optionsSet = new Set(question.options);
                        schemaObject[question.questionId] = z.string().refine(
                            (val) => optionsSet.has(val),
                            { message: "Please select a valid option." }
                        );
                    } else {
                        schemaObject[question.questionId] = z.string();
                    }
                }
                break;
            case 'checkbox':
                if (question.required) {
                    if (question.options && question.options.length > 0) {
                        const optionsTuple: [string, ...string[]] = [question.options[0] as string, ...question.options.slice(1)];
                        schemaObject[question.questionId] = z.array(z.enum(optionsTuple)).min(1, { message: "At least one option must be selected." });
                    } else {
                        schemaObject[question.questionId] = z.array(z.string());
                    }
                }
                break;
            case 'Date':
                if (question.required) {
                    schemaObject[question.questionId] = z.string().refine(val => !isNaN(Date.parse(val)), { message: "Please enter a valid date." });
                }
                break;
            case 'Time':
                if (question.required) {
                    schemaObject[question.questionId] = z.string().min(1,{message: "Please enter a valid time."});
                }
                break;
            case 'fileUpload':
                if (question.required) {
                    schemaObject[question.questionId] = z.string().min(1, { message: "Please upload one file." });
                }

            case 'linearScale':
                if (question.required) {
                    // Assuming the answer is a number within the range [linearStart, linearEnd]
                    schemaObject[question.questionId] = z.string()
                        .refine(val => parseInt(val) >= question.linearStart && parseInt(val) <= question.linearEnd, {
                            message: `Please select a number between ${question.linearStart} and ${question.linearEnd}.`
                        });
                }
                break;
        }
    });

    return z.object(schemaObject);
};
