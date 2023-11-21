import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
const handleError = (error: Error, message: string) => {
    // Log the error for debugging
    console.error(error);

    // Here you can add more complex logic, like sending the error to an error-tracking service

    throw new Error(`${message}: ${error.message}`);
};

const answerValueSchema = z.union([
    z.string(),  // For string answers
    z.array(z.string()) // For array answers
]);

const dynamicAnswerDataSchema = z.array(z.object({questionId: z.string(), value: answerValueSchema}));

export const answerRouter = createTRPCRouter({
    addAnswer: protectedProcedure
        .input(z.object({
            formId: z.string(),
            answer: dynamicAnswerDataSchema,
        }))

        .mutation(async ({ ctx, input }) => {
            const { formId, answer } = input;
            try{
                const answerExists = await ctx.db.answers.findFirst({
                    where: {
                        userId: ctx.session.user.id,
                        formId: formId,
                    },
                });
                if (answerExists) {
                    //update form with existed answer ID
                    const answers = await ctx.db.answers.update({
                        where: {
                            answerId: answerExists.answerId,
                        },
                        data: {
                            answerData: answer,
                        },
                    });
                    
                    return answer;
                } else {
                    const answers = await ctx.db.answers.create({
                        data: {
                            userId: ctx.session.user.id,
                            formId: formId,
                            answerData: answer,
                        },
                    });
                    return answers;
                }
            }
            catch(error){
                handleError(error as Error, "failed to add answer");
            }
            
        }),

        getAnswers: protectedProcedure
        .input(z.object({ formId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { formId } = input;
            try{
                const answers = await ctx.db.answers.findMany({
                    where: {
                        formId: formId,
                    },
                    include:{
                        user:{
                            select:{
                                email: true,
                            }
                        }
                    }
                });
                return answers;
            }
            catch(error){
                handleError(error as Error, "fail to get all answers")
            }
        }),

        getPreviousAnswer: protectedProcedure
        .input(z.object({ formId: z.string() }))
        .query(async ({ ctx, input }) => {
            try{
                const answers = await ctx.db.answers.findFirst({
                    where: {
                        formId: input.formId,
                        userId: ctx.session.user.id
                    },
                });
                
                return answers;
            }
            catch(error){
                handleError(error as Error, "fail to get previous answer");
            }
        })
})