/* eslint-disable */
import { RxCross2 } from "react-icons/rx";
import { LuClock4 } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { ImCheckboxUnchecked } from "react-icons/im";
import { IoCloudUploadOutline,IoCopyOutline } from "react-icons/io5";
import { FaRegCircle, FaTrash } from "react-icons/fa";
import { questionDetail } from "@/types/form";
import { Switch } from '@headlessui/react';
import React, { useState } from 'react';
import { useSortable, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LuGripHorizontal } from "react-icons/lu";
interface QuestionItemProps {
    index: number;
    question: questionDetail;
    updateQuestionField: (index: number, field: keyof questionDetail, value: any) => void;
    handleOptionChange: (questionIndex: number, optionIndex: number, newOptionValue: string) => void;
    addOption: (questionIndex: number, opt?: string) => void;
    deleteOption: (questionIndex: number, optionIndex: number) => void;
    deleteQuestion: (questionId: string) => void;
    onSelect: (index: number) => void;
    copyQuestion: (index : number) => void;
    selectIndex : number;
}
export const QuestionItem: React.FC<QuestionItemProps> = ({
    index,
    question,
    updateQuestionField,
    handleOptionChange,
    addOption,
    deleteOption,
    deleteQuestion,
    onSelect,
    copyQuestion,
    selectIndex
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } = useSortable({ id: question.questionId.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const hasOtherOption = question.options.includes("Others");
    return (
        <div onClick={() => { onSelect(index); }} ref={setNodeRef} style={style} className={`px-12 py-4 bg-white  rounded-2xl ${selectIndex === index ? "border-l-4 border-blue-600" : ""}`}>
            <div className="flex justify-center" {...listeners} {...attributes} >
                <LuGripHorizontal size={24} />
            </div>
            <div className="flex flex-row justify-between mb-3" >
                <input type="text" placeholder="Question" defaultValue={question.questionText} className="focus:border-blue-500 focus:border-b-2 bg-gray-100 p-4 outline-none w-[500px]" onChange={(e) => { updateQuestionField(index, 'questionText', e.target.value) }} />
                <select onChange={(e) => { updateQuestionField(index, 'questionType', e.target.value) }} value={question.questionType} className="w-[180px]">
                    <option value="shortAnswer" className="flex flex-row justify-between items-center">Short Answer</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="multipleChoice">Multiple Choice</option>
                    <option value="checkbox">Checkboxes</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="fileUpload">File Upload</option>
                    <option value="linearScale">Linear Scale</option>
                    <option value="Date">Date</option>
                    <option value="Time">Time</option>
                </select>
            </div>
            {question.questionType === "shortAnswer" && (
                <div className="border-b-2 border-dotted w-[300px] pb-4 mb-12">{"short answer text"}</div>
            )}
            {question.questionType === "paragraph" && (
                <div className="border-b-2 border-dotted w-[500px] pb-4 mb-12">{"long answer text"}</div>
            )}
            {question.questionType === "multipleChoice" && (
                <div>
                    {question.options?.map((option, oindex) => (
                        <div key={oindex} className="flex flex-row items-center mb-3">
                            <FaRegCircle className="mx-2" />
                            <input type="text" className="focus:border-blue-500 focus:border-b-2 outline-none" readOnly={option === "Others"} value={option} onChange={(e) => { handleOptionChange(index, oindex, e.target.value) }} />
                            <RxCross2 onClick={() => { deleteOption(index, oindex) }} />
                        </div>
                    ))}
                    <div className="flex flex-row items-center mb-2">
                        <FaRegCircle className="mx-2" />
                        <button className="focus:border-b-2 border-dotted cursor-text text-gray-400" onClick={() => { addOption(index) }}>{"Add Option"}</button>
                        {!hasOtherOption && (<div className="flex flex-row items-center">
                            <p className="px-1">{"Or"}</p>
                            <button className="focus:border-b-2 border-dotted hover:bg-gray-200 px-2 rounded-md text-blue-700" onClick={() => { addOption(index, "Others") }}>{`add "Others"`}</button>
                        </div>)}
                    </div>
                </div>

            )}
            {question.questionType === "checkbox" && (
                <div>
                    {question.options?.map((option, oindex) => (
                        <div key={oindex} className="flex flex-row items-center mb-3">
                            <ImCheckboxUnchecked className="mx-2" />
                            <input type="text" className="focus:border-blue-500 focus:border-b-2 outline-none" readOnly={option === "Others"} value={option} onChange={(e) => { handleOptionChange(index, oindex, e.target.value) }} />
                            <RxCross2 onClick={() => { deleteOption(index, oindex) }} />
                        </div>
                    ))}
                    <div className="flex flex-row items-center mb-2">
                        <ImCheckboxUnchecked className="mx-2" />
                        <button className="focus:border-b-2 border-dotted cursor-text pr-2 text-gray-400" onClick={() => { addOption(index) }}>{"Add Option"}</button>
                        {!hasOtherOption && (<div className="flex flex-row items-center px-1">
                            <p className="px-1">{"Or"}</p>
                            <button className="focus:border-b-2 border-dotted hover:bg-gray-200 px-2 rounded-md text-blue-700" onClick={() => { addOption(index, "Others") }}>{`add "Others"`}</button>
                        </div>)}
                    </div>
                </div>

            )}
            {question.questionType === "dropdown" && (
                <div>
                    {question.options?.map((option, oindex) => (
                        <div key={oindex} className="flex flex-row items-center mb-3">
                            <p className="pr-2">{oindex + 1}</p>
                            <input type="text" className="focus:border-blue-500 focus:border-b-2 outline-none" readOnly={option === "Others"} value={option} onChange={(e) => { handleOptionChange(index, oindex, e.target.value) }} />
                            <RxCross2 onClick={() => { deleteOption(index, oindex) }} />
                        </div>
                    ))}
                    <div className="flex flex-row items-center mb-2">
                        <p className="pr-2">{question?.options?.length ? question.options.length + 1 : ""}</p>
                        <button className="hover:border-b-2 border-dotted cursor-text text-gray-400" onClick={() => { addOption(index) }}>{"Add Option"}</button>
                    </div>
                </div>

            )}

            {question.questionType === "fileUpload" && (
                <div className="text-gray-400 border-2 border-gray-200 w-[100px] justify-between p-2 flex flex-row items-center rounded">
                    <IoCloudUploadOutline /> {"Add File"}
                </div>
            )}
            {question.questionType === "linearScale" && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row gap-3">
                        <select className="w-[50px]" value={question.linearStart} onChange={(e) => { updateQuestionField(index, 'linearStart', Number(e.target.value)) }}>
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                        </select>
                        <p>To</p>
                        <select className="w-[50px]" value={question.linearEnd} onChange={(e) => { updateQuestionField(index, 'linearEnd', Number(e.target.value)) }}>
                            {Array.from({ length: 9 }, (_, i) => i + 2).map(number => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-row gap-6">
                        <p>{question.linearStart}</p>
                        <input type="text" placeholder="Label(optional)" className="focus:border-blue-500 focus:border-b-2 outline-none" onChange={(e) => { updateQuestionField(index, 'linearStartText', e.target.value) }} />
                    </div>
                    <div className="flex flex-row gap-6">
                        <p>{question.linearEnd}</p>
                        <input type="text" placeholder="Label(optional)" className="focus:border-blue-500 focus:border-b-2 outline-none" onChange={(e) => { updateQuestionField(index, 'linearEndText', e.target.value) }} />
                    </div>
                </div>
            )}
            {question.questionType === "Date" && (
                <div className="flex flex-row w-[200px] justify-between items-center border-b-2 border-dotted pb-3   mb-12">{"Month,Day and Year"} <SlCalender /></div>
            )}
            {question.questionType === "Time" && (
                <div className="flex flex-row w-[200px] justify-between items-center border-b-2 border-dotted pb-3   mb-12">{"Time"} <LuClock4 /></div>
            )}
            <div className="flex flex-row justify-end gap-6 items-center border-t-2 border-gray-200 py-4 mt-5">
                <IoCopyOutline onClick={()=> {copyQuestion(index)}}/>
                <FaTrash onClick={() => { deleteQuestion(question.questionId) }} />
                <div className="flex flex-row items-center gap-3">
                    <span className="ml-3 text-sm font-medium text-gray-900">
                        Required
                    </span>
                    <Switch
                        checked={question.required}
                        onChange={() => { updateQuestionField(index, 'required', !question.required) }}
                        className={`${question.required ? 'bg-blue-600' : 'bg-gray-200'}
                                relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                    >
                        <span
                            className={`${question.required ? 'translate-x-6' : 'translate-x-1'}
                                    inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        />
                    </Switch>
                </div>
            </div>
        </div>
    )
}