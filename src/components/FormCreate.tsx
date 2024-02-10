/* eslint-disable */
import { useState, useEffect, useRef, use } from "react";
import { FormState, form, questionDetail } from "@/types/form";
import { FaPlusCircle } from "react-icons/fa";
import { api } from "@/utils/api";
import useFormState from "@/hooks/useFormState";
import { QuestionItem } from "./QuestionItem";
import { v4 as uuidv4 } from "uuid";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, } from '@dnd-kit/sortable';
export const FormCreate = ({ formData }: { formData: form }) => {
    const parseFormState = (data: any) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            return data;
        }
        return {
            questions: [
                {
                    questionId: uuidv4(),
                    questionText: "",
                    questionType: "multipleChoice",
                    options: ["Option 1"],
                    linearStart: 1,
                    linearEnd: 5,
                    linearStartText: "",
                    linearEndText: "",
                }
            ]
        }; // Default initial state
    };
    const updateFormState = api.form.updateFormState.useMutation();
    const updateFormTitle = api.form.updateFormTitle.useMutation();
    const inputContainer = useRef<HTMLDivElement>(null);
    const initialTitleValue = useRef<string>(formData.formTitle);
    const [formTitle, setFormTitle] = useState<string>(formData.formTitle);
    const formTitleRef = useRef<string>(formTitle);
    useEffect(() => {
        formTitleRef.current = formTitle;
    }, [formTitle]);
    const updateForm = () => {
        updateFormState.mutateAsync({ formState: formState, formId: formData.formId });
    }

    const {
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
        copyQuestion,
    } = useFormState(parseFormState(formData.formData));

    useEffect(() => {
        function clickOutsideEvent(event: MouseEvent) {
            if (
                inputContainer.current &&
                !inputContainer.current.contains(event.target as HTMLElement)
            ) {
                console.log(JSON.stringify(formTitleRef.current) !== JSON.stringify(initialTitleValue.current))
                if (JSON.stringify(formTitleRef.current) !== JSON.stringify(initialTitleValue.current)) {
                    initialTitleValue.current = formTitleRef.current;
                    updateFormTitle.mutateAsync({ formTitle: formTitleRef.current, formId: formData.formId });
                }
            }
        }

        document.addEventListener("click", clickOutsideEvent);
        return () => {
            document.removeEventListener("click", clickOutsideEvent);
        };
    }, [])

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            let oldIndex = formState.questions.findIndex((q) => q.questionId === active.id);
            let newIndex = formState.questions.findIndex((q) => q.questionId === over.id);
            let reorderedQuestions: questionDetail[] = arrayMove(formState.questions, oldIndex, newIndex);
            let newFormState: FormState = { ...formState, questions: reorderedQuestions };
            setFormState(newFormState);
        }
    };
    function arrayMove<T>(array: T[], from: number, to: number): T[] {
        const newArray = array.slice();
        const [movedItem] = newArray.splice(from, 1);
        if (movedItem) {
            newArray.splice(to, 0, movedItem);
        }

        return newArray;
    }

    return (
        <div className="mx-72">
            <div ref={inputContainer} className="px-12 py-8 bg-white mb-8 rounded-xl border-t-8 border-purple-700">
                <input type="text" defaultValue={formTitle} className="text-4xl focus:border-blue-500 focus:border-b-2 p-2 outline-none " onChange={(e) => { setFormTitle(e.target.value) }} />
            </div>
            <div >
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext items={formState.questions.map((q) => q.questionId)}>
                        {formState.questions.map((question, index) => (
                            <div className="flex flex-row gap-3 mb-8" key={question.questionId}>
                                <div>
                                    <QuestionItem
                                        index={index}
                                        question={question}
                                        updateQuestionField={updateQuestionField}
                                        handleOptionChange={handleOptionChange}
                                        addOption={addOption}
                                        deleteOption={deleteOption}
                                        deleteQuestion={deleteQuestion}
                                        onSelect={setSelectedQuestionIndex}
                                        copyQuestion={copyQuestion}
                                        selectIndex={selectedQuestionIndex as number}
                                    />

                                </div>
                                {selectedQuestionIndex === index && (
                                    <div className="bg-white py-8 rounded px-4">
                                        <FaPlusCircle onClick={() => { addNewQuestion(index) }} />
                                    </div>
                                )}

                            </div>

                        ))}
                    </SortableContext>
                </DndContext>
                <div className="pb-4 flex flex-row justify-end gap-6">
                    <button className="bg-blue-500 px-2 py-1 rounded text-white" onClick={updateForm}>submit form</button>

                </div>
            </div>

        </div>
    );
};
