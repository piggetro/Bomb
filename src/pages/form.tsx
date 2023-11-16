import ShortAnswer from "~/components/questions/shortAnswer";
import MultipleChoice from "~/components/questions/multipleChoice";
import Option from "~/components/options";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Question } from "~/types/forms.types";
import Checkboxes from "~/components/questions/checkboxes";
import Dropdown from "~/components/questions/dropdown";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

export default function AddForm() {
  const router = useRouter();
  let toastId: string;
  const [questions, setQuestions] = useState<Question[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const { mutate, isLoading: isPosting } = api.form.createForm.useMutation({
    onSuccess: () => {
      toast.success("Form Created", { id: toastId });
      router.push("/");
    },
    onError: (e) => {
      toast.error("Something went wrong");
    },
  });

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

    mutate({
      formName: nameRef.current.value,
      formDescription: descriptionRef.current?.value,
      questions,
    });
  };

  useEffect(() => {
    nameRef.current && (nameRef.current.value = "Form");
  }, []);

  useEffect(() => {
    if (isPosting) {
      toastId = toast.loading("Loading...");
    }
  }, [isPosting]);

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
          className="me-10 bg-transparent text-3xl font-bold outline-none"
        />
        <Option onClick={addNewQuestion} />
        <button
          onClick={onSubmit}
          disabled={isPosting}
          type="button"
          className="mx-5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Save Form
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
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                    />
                  );
                case "multiple":
                  return (
                    <MultipleChoice
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                    />
                  );
                case "checkboxes":
                  return (
                    <Checkboxes
                      key={question.questionId}
                      id={question.questionId}
                      setQuestions={setQuestions}
                    />
                  );
                case "dropdown":
                  return (
                    <Dropdown
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
