-- CreateTable
CREATE TABLE "QuestionType" (
    "questionTypeId" STRING NOT NULL,
    "questionType" STRING NOT NULL,

    CONSTRAINT "QuestionType_pkey" PRIMARY KEY ("questionTypeId")
);

-- CreateTable
CREATE TABLE "Form" (
    "formId" STRING NOT NULL,
    "formDescription" STRING,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formName" STRING NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("formId")
);

-- CreateTable
CREATE TABLE "Question" (
    "questionId" STRING NOT NULL,
    "questionNumber" INT4 NOT NULL,
    "question" STRING NOT NULL,
    "questionTypeId" STRING NOT NULL,
    "formId" STRING NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "questionOptionId" STRING NOT NULL,
    "questionOption" STRING NOT NULL,
    "questionId" STRING NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("questionOptionId")
);

-- CreateTable
CREATE TABLE "Answer" (
    "answerId" STRING NOT NULL,
    "formId" STRING NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("answerId")
);

-- CreateTable
CREATE TABLE "AnswerQuestion" (
    "answerQuestionId" STRING NOT NULL,
    "answerId" STRING NOT NULL,
    "questionId" STRING NOT NULL,
    "answerText" STRING,
    "answerOptions" STRING[],

    CONSTRAINT "AnswerQuestion_pkey" PRIMARY KEY ("answerQuestionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionType_questionType_key" ON "QuestionType"("questionType");

-- CreateIndex
CREATE INDEX "Question_questionTypeId_idx" ON "Question"("questionTypeId");

-- CreateIndex
CREATE INDEX "Question_formId_idx" ON "Question"("formId");

-- CreateIndex
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");

-- CreateIndex
CREATE INDEX "Answer_formId_idx" ON "Answer"("formId");

-- CreateIndex
CREATE INDEX "AnswerQuestion_answerId_idx" ON "AnswerQuestion"("answerId");

-- CreateIndex
CREATE INDEX "AnswerQuestion_questionId_idx" ON "AnswerQuestion"("questionId");
