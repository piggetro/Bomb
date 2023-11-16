import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { format } from "date-fns";
import { Form } from "~/types/forms.types";

export const formRouter = createTRPCRouter({
  getForms: publicProcedure.query(async ({ ctx }) => {
    const forms = await ctx.db.form.findMany({
      orderBy: { dateCreated: "desc" },
      select: {
        formId: true,
        formName: true,
        dateCreated: true,
      },
    });

    const formattedForms = forms.map((form) => ({
      ...form,
      dateCreated: format(form.dateCreated, "dd/MM/yyyy"),
    }));
    return formattedForms;
  }),
  createForm: publicProcedure
    .input(
      z.object({
        formName: z.string(),
        formDescription: z.string().optional(),
        questions: z.array(
          z.object({
            question: z.string(),
            questionType: z.object({ questionType: z.string() }),
            answer: z.string().optional(),
            questionNumber: z.number(),
            questionOption: z
              .array(
                z.object({
                  questionOption: z.string(),
                }),
              )
              .optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { formName, formDescription, questions } = input;

      const createdForm = await ctx.db.form.create({
        data: {
          formName,
          formDescription,
        },
      });

      for (const questionData of questions) {
        const { question, questionType, questionNumber, questionOption } =
          questionData;

        const createdQuestion = await ctx.db.question.create({
          data: {
            questionNumber: questionNumber,
            question,
            questionType: {
              connectOrCreate: {
                where: { questionType: questionType.questionType },
                create: { questionType: questionType.questionType },
              },
            },
            form: {
              connect: {
                formId: createdForm.formId,
              },
            },
          },
        });
        if (questionOption?.length) {
          await ctx.db.questionOption.createMany({
            data: questionOption.map((option) => ({
              questionOption: option.questionOption,
              questionId: createdQuestion.questionId,
              isAnswer: false,
            })),
          });
        }
      }
    }),
  getForm: publicProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.form.findFirst({
        where: { formId: input.formId },
        include: {
          questions: {
            orderBy: { questionNumber: "asc" },
            select: {
              questionId: true,
              questionNumber: true,
              question: true,
              questionType: {
                select: {
                  questionType: true,
                },
              },
              questionOption: {
                select: {
                  questionOptionId: true,
                  questionOption: true,
                },
              },
            },
          },
        },
      });
    }),
});

// export const formRouter = createTRPCRouter({
//   hello: publicProcedure
//     .input(z.object({ text: z.string() }))
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input.text}`,
//       };
//     }),

//   create: publicProcedure
//     .input(z.object({ name: z.string().min(1) }))
//     .mutation(async ({ ctx, input }) => {
//       // simulate a slow db call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       return ctx.db.post.create({
//         data: {
//           name: input.name,
//         },
//       });
//     }),

//   getLatest: publicProcedure.query(({ ctx }) => {
//     return ctx.db.post.findFirst({
//       orderBy: { createdAt: "desc" },
//     });
//   }),
