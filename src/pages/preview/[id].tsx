import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState, useRef, useEffect } from "react";
import type { Question } from "~/types/forms.types";
import ShortAnswer from "~/components/questions/shortAnswer";
import MultipleChoice from "~/components/questions/multipleChoice";
import Checkboxes from "~/components/questions/checkboxes";
import Dropdown from "~/components/questions/dropdown";
import Error from "next/error";

export default function PreviewForm({
  formId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  let toastId: string;
  const [questions, setQuestions] = useState<Question[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = api.form.getForm.useQuery({ formId });

  useEffect(() => {
    if (!isLoading && data) {
      console.log(data.questions);
      setQuestions(data.questions);
      nameRef.current && (nameRef.current.value = data?.formName!);
      descriptionRef.current &&
        (descriptionRef.current.value = data?.formDescription!);
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="flex h-screen w-full justify-center overflow-y-auto bg-pink-200">
      <div className="my-4 w-3/5 rounded-md p-3">
        <div
          className="my-5 w-full cursor-pointer text-2xl font-bold"
          onClick={() => {
            router.push("/");
          }}
        >
          Go Back
        </div>
        <h1 className="me-2 bg-transparent text-3xl font-bold outline-none">
          {data.formName}
        </h1>
        <h1 className="me-2 bg-transparent text-3xl font-bold outline-none">
          {data.formDescription}
        </h1>
        <div className="my-5">
          <div className="space-y-5">
            {questions.map((question) => {
              switch (question.questionType.questionType) {
                case "short":
                  return (
                    <ShortAnswer
                      question={question}
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                      isAnswerable={true}
                    />
                  );
                case "multiple":
                  return (
                    <MultipleChoice
                      question={question}
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                      isAnswerable={true}
                    />
                  );
                case "checkboxes":
                  return (
                    <Checkboxes
                      question={question}
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                      isAnswerable={true}
                    />
                  );
                case "dropdown":
                  return (
                    <Dropdown
                      question={question}
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                      isAnswerable={true}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = (async (context) => {
  const formId = context.params?.id;

  if (typeof formId !== "string") {
    throw {
      status: 404,
    };
  }

  return { props: { formId } };
}) satisfies GetServerSideProps<{
  formId: String;
}>;
