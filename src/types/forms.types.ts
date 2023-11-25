// export type Form = {
//   formId: string;
//   name: string;
//   dateCreated: String;
// };

// export type Question = {
//   id: string;
//   number: number;
//   type: string;
//   question: string;
//   options?: Option[];
// };

// export type Option = {
//   optionId: string;
//   option: string;
//   selected?: boolean | false;
// };


export type Form = {
  formId: string;
  formDescription: string;
  dateCreated: string | Date;
  formName: string;
  questions: Question[];
};

export type Question = {
  questionId: string;
  questionNumber: number;
  question: string;
  answer?: string;
  questionType: QuestionType;
  questionOption?: QuestionOption[];
};

export type QuestionOption = {
  questionOptionId: string;
  questionOption: string;
  isAnswer?: boolean | false;
};

export type QuestionType = {
  questionType: string;
};

export type FormList = {
  formId: string;
  formName: string;
  dateCreated: string;
  formDescription: string;
}
