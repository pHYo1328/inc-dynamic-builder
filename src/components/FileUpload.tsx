import { Answer, CloudinaryUploadResult } from "@/types/answer";
import { questionDetail } from "@/types/form";
import { CldUploadButton,CldImage } from "next-cloudinary";
export const FileUpload = ({findAnswerIndex,answers,setAnswers,question} : {findAnswerIndex : (questionId :string)=>number,answers : Answer[],setAnswers : (answers:Answer[])=>void,question: questionDetail }) => {
    const handleUpload = (result: CloudinaryUploadResult, questionId: string) => {
        if (result.info && result.info.secure_url) {
            const index = findAnswerIndex(questionId);
            const newAnswers = [...answers];
            console.log(newAnswers);
            if (index > -1) {
                // Update the existing answer
                newAnswers[index] = { ...newAnswers[index], value: result.info.secure_url } as Answer;
            } else {
                // Add a new answer
                newAnswers.push({ questionId, value: result.info.secure_url });
            }
            setAnswers(newAnswers);
        }

    };
    return (
        <div>
            <CldUploadButton
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                onUpload={(result) => { handleUpload(result as CloudinaryUploadResult, question.questionId) }}
                uploadPreset="npnaf2hg"
            />
            {
                (answers.find(a => a.questionId === question.questionId)?.value) && (
                    <CldImage
                        width="200"
                        height="200"
                        src={answers.find(a => a.questionId === question.questionId)?.value as string}
                        sizes="100vw"
                        alt="Uploaded Image"
                    />
                )
            }

        </div>
    )
}