/* eslint-disable */
import { useRouter } from 'next/router';
import { api } from "@/utils/api";
import { AnswerForm } from "@/components/AnswerForm";
import { form } from "@/types/form";
import { useSession, signIn } from "next-auth/react";

export default function form() {
    const router = useRouter();
    const { formId } = router.query; // Extracting formId from the URL

    const { data: sessionData, status } = useSession();
    const loading = status === "loading";
    if (!sessionData && !loading) {
        signIn();
        return null;
    }

    // Replace the hardcoded id with the formId from the URL
    const { data: formToGenerate, isLoading } = api.form.getFromById.useQuery({ formId: formId as string },{enabled : !!formId});

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!formToGenerate) {
        return <div>Form not found</div>; // Handle case where form is not found
    }

    return (
        <div className="bg-purple-200 min-h-screen py-4">
            <AnswerForm formData={formToGenerate as form} />
        </div>
    );
}
