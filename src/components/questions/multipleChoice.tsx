import { useRef, useEffect, Dispatch, SetStateAction, useState } from "react";
import type { QuestionOption, Question } from "~/types/forms.types";
import { v4 as uuidv4 } from "uuid";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

export default function MultipleChoice({
  question,
  id: questionId,
  setQuestions,
  isAnswerable = false,
}: {
  question?: Question;
  id: string;
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  isAnswerable?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<QuestionOption[]>(
    question?.questionOption || [],
  );

  const addOption = () => {
    setQuestions((prev: Question[]) =>
      prev.map((question) => {
        if (question.questionId === questionId) {
          return {
            ...question,
            questionOption: options,
          };
        } else {
          return question;
        }
      }),
    );
  };

  useEffect(() => {
    addOption();
  }, [options]);

  useEffect(() => {
    inputRef.current &&
      (inputRef.current.value = question?.question || "Question");
    if (!question?.questionOption) {
      setOptions([
        {
          questionOptionId: uuidv4(),
          questionOption: "Option",
        },
      ]);
      addOption();
    }
  }, []);

  return (
    <div className="round-lg bg-white p-5">
      <input
        className="text-md my-3 w-full bg-transparent outline-none"
        placeholder="Question"
        ref={inputRef}
        disabled={isAnswerable}
        onChange={(e) => {
          setQuestions((prev) =>
            prev.map((question) => {
              if (question.questionId === questionId) {
                return {
                  ...question,
                  question: e.target.value,
                };
              } else {
                return question;
              }
            }),
          );
        }}
      />
      <fieldset className="mt-4">
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.questionOptionId} className="flex items-center">
              <input
                id={option.questionOptionId}
                name={questionId}
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                checked={option?.isAnswer}
                disabled={!isAnswerable}
              />
              <input
                disabled={isAnswerable}
                type="text"
                value={option.questionOption}
                onChange={(e) => {
                  setOptions((prev: QuestionOption[]) =>
                    prev.map((prevOption) => {
                      if (
                        prevOption.questionOptionId === option.questionOptionId
                      ) {
                        return {
                          ...prevOption,
                          questionOption: e.target.value,
                        };
                      } else {
                        return prevOption;
                      }
                    }),
                  );
                }}
                className="ml-3 block bg-transparent text-sm font-medium leading-6 text-gray-900 outline-none"
              />
            </div>
          ))}
          {!isAnswerable && (
            <div
              className="cursor-pointer"
              onClick={() => {
                setOptions((prev: QuestionOption[]) => [
                  ...prev,
                  { questionOptionId: uuidv4(), questionOption: "Option" },
                ]);
              }}
            >
              <PlusCircleIcon width={20} height={20} />
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
}
