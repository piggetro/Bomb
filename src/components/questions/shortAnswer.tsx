import { useRef, useEffect, Dispatch, SetStateAction, useState } from "react";
import type { Question } from "~/types/forms.types";

export default function ShortAnswer({
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

  useEffect(() => {
    inputRef.current && (inputRef.current.value = question?.question || "Question");
  }, []);

  return (
    <div className="rounded-lg bg-white p-5">
      <input
        className="text-md my-3 w-full bg-transparent outline-none"
        placeholder="Question"
        ref={inputRef}
        onChange={(e) => {
          setQuestions((prev) =>
            prev.map((question) => {
              if (question.questionId === questionId) {
                return { ...question, question: e.target.value };
              } else {
                return question;
              }
            }),
          );
        }}
      />
      <input
        disabled={!isAnswerable}
        className="text-md my-3 w-full bg-transparent outline-none"
        placeholder="Answer"
      />
    </div>
  );
}
