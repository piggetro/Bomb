import { useRef, useEffect, Dispatch, SetStateAction, useState } from "react";
import type { QuestionOption, Question } from "~/types/forms.types";
import { v4 as uuidv4 } from "uuid";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

export default function Dropdown({
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
    }
  }, []);

  return (
    <div className="round-lg bg-white p-5">
      <input
        className="text-md my-3 w-full bg-transparent outline-none"
        placeholder="Question"
        ref={inputRef}
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
      {!isAnswerable ? (
        <div>
          {options.map((option) => (
            <div
              className="flex items-center space-x-2"
              key={option.questionOptionId}
            >
              <input
                value={option.questionOption}
                className="text-md my-3 w-full bg-transparent outline-none"
                onChange={(e) => {
                  setOptions((prev) =>
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
              />
            </div>
          ))}
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
        </div>
      ) : (
        <div>Answer</div>
      )}
    </div>
  );
}
