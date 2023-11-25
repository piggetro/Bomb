import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import Option from "~/components/options";
import ShortAnswer from "~/components/questions/shortAnswer";
import MultipleChoice from "~/components/questions/multipleChoice";
import Checkboxes from "~/components/questions/checkboxes";
import Dropdown from "~/components/questions/dropdown";
import type { Question } from "~/types/forms.types";
import Error from "next/error";

export default function EditForm({
  formId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  let toastId: string;
  const [questions, setQuestions] = useState<Question[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = api.form.getForm.useQuery({ formId });

  const { mutate, isLoading: isPosting } = api.form.updatedForm.useMutation({
    onSuccess: () => {
      toast.success("Form Updated", { id: toastId });
    },
    onError: (e) => {
      toast.error("Something went wrong", { id: toastId });
    },
  });

  useEffect(() => {
    if (isPosting) {
      toastId = toast.loading("Loading...");
    }
  }, [isPosting]);

  useEffect(() => {
    if (!isLoading && data) {
      console.log(data.questions)
      setQuestions(data.questions);
      nameRef.current && (nameRef.current.value = data?.formName!);
      descriptionRef.current &&
        (descriptionRef.current.value = data?.formDescription!);
    }
  }, [isLoading]);

  const addNewQuestion = (questionType: string) => {
    const newQuestion: Question = {
      questionId: uuidv4(),
      questionNumber: questions.length + 1,
      questionType: { questionType },
      question: "Question",
    };

    setQuestions([...questions, newQuestion]);
  };

  const onSubmit = () => {
    if (!nameRef?.current || !nameRef.current?.value)
      return toast.error("Please enter a name");
    else if (questions.length === 0)
      return toast.error("Please add a question");
    console.log(questions)
    // mutate({
    //   formId,
    //   formName: nameRef.current.value,
    //   formDescription: descriptionRef.current?.value,
    //   questions,
    // });
  };

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
        <input
          ref={nameRef}
          placeholder="Form Name"
          className="me-2 bg-transparent text-3xl font-bold outline-none"
        />
        <Option onClick={addNewQuestion} />
        <button
          onClick={onSubmit}
          disabled={isPosting}
          type="button"
          className="mx-5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Update Form
        </button>
        <button
          onClick={() => router.push(`/preview/${formId}`)}
          disabled={isPosting}
          type="button"
          className="mx-5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Preview Form
        </button>
        <input
          ref={descriptionRef}
          className="text-md my-3 w-full bg-transparent outline-none"
          placeholder="Description"
        />
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
                    />
                  );
                case "multiple":
                  return (
                    <MultipleChoice
                      question={question}
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                    />
                  );
                case "checkboxes":
                  return (
                    <Checkboxes
                      question={question}
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                    />
                  );
                case "dropdown":
                  return (
                    <Dropdown
                      question={question}
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
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
