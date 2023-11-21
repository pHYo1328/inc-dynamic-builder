// useFormState.ts
import { useState } from 'react';
import { FormState, questionDetail } from '@/types/form';

import { v4 as uuidv4 } from "uuid";

const useFormState = (initialState: FormState) => {
    const [formState, setFormState] = useState<FormState>(initialState);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

    const updateQuestionField = <T extends keyof questionDetail>(index: number, field: T, value: questionDetail[T]) => {
        const updatedQuestion : questionDetail = { ...formState.questions[index], [field]: value } as questionDetail;
        const newQuestions = [...formState.questions];
        newQuestions[index] = updatedQuestion;
        setFormState({ questions: newQuestions });
    };

    const handleOptionChange = (questionIndex: number, optionIndex: number, newOptionValue: string) => {
        const updatedQuestions = formState.questions.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                const updatedOptions = question?.options?.map((option, oIndex) => {
                    return oIndex === optionIndex ? newOptionValue : option;
                });
                return { ...question, options: updatedOptions };
            }
            return question;
        });

        setFormState({ ...formState, questions: updatedQuestions });
    };

    const addNewQuestion = (index: number) => {
        const newQuestion: questionDetail = {
            questionId: uuidv4(),
            questionText: "",
            questionType: "multipleChoice",
            options: ["Option 1"],
            linearStart: 1,
            linearEnd: 5,
            linearStartText: "",
            linearEndText: "",
            required: false,
        };
    
        // Clone the current questions array
        const updatedQuestions = [...formState.questions];
        const insertIndex = index + 1;
    
        updatedQuestions.splice(insertIndex, 0, newQuestion);
        setFormState({ ...formState, questions: updatedQuestions });
        setSelectedQuestionIndex(insertIndex);
    };

    const addOption = (questionIndex: number, opt?: string) => {
        const updatedQuestions = formState.questions.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                const options = question.options || [];
                if (opt) return { ...question, options: [...options, opt] };
                return { ...question, options: [...options, `Option ${options.length + 1}`] };
            }
            return question;
        });

        setFormState({ ...formState, questions: updatedQuestions });
    };

    const deleteOption = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = formState.questions.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                const filteredOptions = question?.options?.filter((_, oIndex) => oIndex !== optionIndex);
                return { ...question, options: filteredOptions };
            }
            return question;
        });

        setFormState({ ...formState, questions: updatedQuestions });
    };

    const deleteQuestion = (questionId: string) => {
        setFormState(prevState => ({
            ...prevState,
            questions: prevState.questions.filter(question => question.questionId !== questionId)
        }));
        setSelectedQuestionIndex(null);
    };

    const copyQuestion = (questionIndex: number) => {
        if (questionIndex < 0 || questionIndex >= formState.questions.length) {
            // Index out of bounds
            return;
        }
    
        // Deep clone the question object
        const questionToCopy : questionDetail = { ...formState.questions[questionIndex] } as questionDetail;
    
        // Generate a new unique ID for the copied question
        questionToCopy.questionId = uuidv4();
    
        // Insert the copied question into the array right after the original
        const newQuestions = [...formState.questions];
        const insertIndex = questionIndex + 1;
        newQuestions.splice(insertIndex, 0, questionToCopy);
        setFormState({ ...formState, questions: newQuestions });
    };

    

    return {
        formState,
        setFormState,
        selectedQuestionIndex,
        setSelectedQuestionIndex,
        updateQuestionField,
        handleOptionChange,
        addNewQuestion,
        addOption,
        deleteOption,
        deleteQuestion,
        copyQuestion
    };
};

export default useFormState;