import { Answer } from '@/types/answer';
import { FormState, form, questionDetail } from '@/types/form';
import { api } from '@/utils/api';
import React from 'react';

// Function to check if an object is a FormState
function isFormState(obj: any): obj is FormState {
    return obj && Array.isArray(obj.questions);
}
export const Responses = ({ formData }: { formData: form }) => {
    const { data: answers, isLoading } = api.answer.getAnswers.useQuery({ formId: formData.formId });
    console.log(answers);
    const renderQuestionsAndAnswers = () => {
        const formState = isFormState(formData.formData) ? formData.formData : null;
        if (!formState) {
            return <div>Invalid form data</div>;
        }
        return formState.questions.map((question: questionDetail) => {
            const allAnswersForQuestion = answers?.flatMap(answerObj => {
                if (answerObj && answerObj.answerData) {
                    const answerArray = answerObj.answerData as Answer[];
                    return answerArray
                        .filter((data: Answer) => data.questionId === question.questionId)
                        .map((answer: Answer) => `${answerObj.user.email}: ${answer.value}`);
                }
                return [];
            });

            return (
                <div key={question.questionId} className='mx-72'>
                    <div className='bg-white p-4 my-3 rounded-xl'>
                        <h2><b>Question</b> : {question.questionText}</h2>
                        <div>
                            <b>Responses: </b>
                            {allAnswersForQuestion && allAnswersForQuestion.length > 0 ? (
                                allAnswersForQuestion.map((response, index) => (
                                    <p key={index}>{response}</p>
                                ))
                            ) : (
                                <p>No answer</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {renderQuestionsAndAnswers()}
        </div>
    );
};
