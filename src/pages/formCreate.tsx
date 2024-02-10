/* eslint-disable */
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { FormCreate } from "@/components/FormCreate"
import { Responses } from "@/components/Responses";
import { form } from "@/types/form";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default () => {
    const [currentView, setCurrentView] = useState("formCreate");
    const { data: sessionData, status } = useSession();
    const loading = status === "loading";
    if (!sessionData && !loading) {
        signIn();
        return null;
    }
    const router = useRouter();
    const { formId } = router.query;

    const { data: form, isLoading } = api.form.getFromById.useQuery({ formId: formId as string });
    const shareableLink = `http://localhost:3000/${formId}`;
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(shareableLink);
        toast.success("shareable link is copied to clipboard")
    }
    if (isLoading) {
        return (<div>Loading...</div>)
    }
    return (
        <div className="bg-purple-100 min-h-screen">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <nav className="bg-white shadow-lg my-3">
                <div className="flex justify-end  mr-6  ">
                    <button onClick={copyLinkToClipboard} className="px-3 py-1 bg-purple-500 text-white rounded"> Share</button>
                </div>
                <ul className="flex justify-center h-[50px]">
                    <li className="mr-6 ">
                        <button onClick={() => setCurrentView("formCreate")} className=" hover:border-b-2 hover:border-blue-800">
                            Questions
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setCurrentView("responses")} className="hover:border-b-2 hover:border-blue-800">
                            Responses
                        </button>
                    </li>
                </ul>

            </nav>
            {currentView === "formCreate" && <FormCreate formData={form as form} />}
            {currentView === "responses" && <Responses formData={form as form} />}
        </div>
    );

}