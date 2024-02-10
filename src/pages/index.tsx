/* eslint-disable */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "@/utils/api";
import { FaPlus } from "react-icons/fa";
import { useRouter } from 'next/router';
import { UserTimezoneDate } from "@/components/userTimeZoneDate";
export default function Home() {
  const { data: sessionData } = useSession();
  const { data: recentForms, isLoading : recentFormLoading } = api.form.getRecentForm.useQuery(
    { userId: sessionData?.user.id as string },
    {
      // Enable the query only if the user ID is available
      enabled: !!sessionData?.user.id,
    }
  );
  const {data : allForms, isLoading : allFormsLoading} = api.form.getAllForms.useQuery(
    { userId: sessionData?.user.id as string },
    {
      // Enable the query only if the user ID is available
      enabled: !!sessionData?.user.id,
    }
  )
  const router = useRouter();

  const createForm = api.form.createForm.useMutation({
    onSuccess: (data) => {
      router.push({
        pathname: '/formCreate',
        query: { formId: data?.formId },
      });
    }
  });
  const handleAddForm = () => {
    if (sessionData) {
      createForm.mutateAsync({
        userId: sessionData?.user.id,
        formTitle: "Untitled form"
      });
    }
    else signIn();
  }
  return (
    <>
      <Head>
        <title>INC MINI FORM PET PROJECT</title>
      </Head>
      <header className="sticky top-0 flex flex-row items-center justify-between p-2 bg-purple-600">
        <b className="text-white italic scr">INC MINI FORM PET PROJECT</b>
        <button
          className="rounded-full bg-black px-10 py-3 font-semibold text-white no-underline transition hover:bg-black/10"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>

      </header>
      <main className="pt-[header-height]">
        <div>
        <h1 className="text-2xl font-bold p-4">Recent Forms</h1>
        <div className="grid grid-cols-6 gap-2 p-2">
          <button className="flex items-center justify-center bg-blue-500 text-white py-12 rounded" onClick={() => { handleAddForm() }}>
            <FaPlus />
          </button>
          {sessionData && (
            recentFormLoading
              ? <p>Loading...</p>
              : recentForms?.map(form => (
                <div key={form.formId} onClick={() => {
                  router.push({
                    pathname: '/formCreate',
                    query: { formId: form.formId },
                  });
                }} className="flex flex-col justify-center items-center bg-purple-500 text-white py-12 rounded">
                  <h2>Title : {form.formTitle}</h2>
                  <p className="flex flex-row">created: <UserTimezoneDate date={form.createdAt}/></p>
                  <p className="flex flex-row">updated: <UserTimezoneDate date={form.updatedAt}/></p>
                </div>
              ))
          )}
        </div>
        <h1 className="text-2xl font-bold p-4">All Forms</h1>
        {sessionData && (
            allFormsLoading
              ? <p>Loading...</p>
              : <div className="flex flex-col gap-3 mx-72">
                {allForms?.map(form => (
                <div key={form.formId} onClick={() => {
                  router.push({
                    pathname: '/formCreate',
                    query: { formId: form.formId },
                  });
                }} className="flex flex-col justify-center items-center bg-purple-500 text-white py-12 rounded">
                  <h2>Title : {form.formTitle}</h2>
                  <p className="flex flex-row">created: <UserTimezoneDate date={form.createdAt}/></p>
                  <p className="flex flex-row">updated: <UserTimezoneDate date={form.updatedAt}/></p>
                </div>
              ))
              }
              </div>
          )}
        </div>
      </main>
    </>

  );
}
