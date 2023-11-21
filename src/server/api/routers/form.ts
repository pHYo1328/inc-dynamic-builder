import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { error } from "console";
import { errorUtil } from "node_modules/zod/lib/helpers/errorUtil";
const handleError = (error: Error, message: string) => {
    // Log the error for debugging
    console.error(error);

    // Here you can add more complex logic, like sending the error to an error-tracking service

    throw new Error(`${message}: ${error.message}`);
};

// Define the schema for questionOption
const questionOptionSchema = z.string();

// Define the schema for questionDetail
const questionDetailSchema = z.object({
    questionId: z.string(),
    questionText: z.string(),
    questionType: z.string(),
    options: z.array(questionOptionSchema).optional(),
    linearStart: z.number().optional(),
    linearEnd: z.number().optional(),
    linearStartText: z.string().optional(),
    linearEndText: z.string().optional(),
    required: z.boolean(),
});

// Define the schema for FormState
const formStateSchema = z.object({
    questions: z.array(questionDetailSchema)
});

export const formRouter = createTRPCRouter({
    getRecentForm: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query(async ({ input, ctx }) => {
            try {
                const recentForms = await ctx.db.form.findMany({
                    take: 5,    // in prisma take stands for the same effect as limit
                    orderBy: {
                        updatedAt: 'desc', // sortings in descending order by update time to get recent data
                    },
                    where: {
                        userId: input.userId
                    }
                })
                return recentForms;
            }
            catch (error) {
                handleError(error as Error, "fail to get recent forms data");
                throw error;
            }
        }),
    getAllForms: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const forms = await ctx.db.form.findMany({
                    where: {
                        userId: input.userId
                    }
                })
                return forms;
            }
            catch(errors){
                handleError(errors as Error,"fail to get all forms by user id");
                throw error;
            }
        }),
    getFromById: protectedProcedure
        .input(
            z.object({
                formId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            try {
                const form = await ctx.db.form.findUnique({
                    where: {
                        formId: input.formId
                    },
                });
                return form;
            }
            catch (error) {
                handleError(error as Error, "fail to get form data with id " + input.formId);
            }
        }),
    createForm: protectedProcedure
        .input(z.object({
            formTitle: z.string(),
            userId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await ctx.db.form.create({
                    data: {
                        formTitle: input.formTitle,
                        userId: input.userId,
                    }
                })
                return result;
            }
            catch (error) {
                handleError(error as Error, "Fail to create new form");
            }
        }),

    updateFormTitle: protectedProcedure
        .input(z.object({
            formTitle: z.string(),
            formId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await ctx.db.form.update({
                    where: {
                        formId: input.formId,
                    },
                    data: {
                        formTitle: input.formTitle
                    }
                });
            }
            catch (error) {
                handleError(error as Error, "fail to update the form title")
            }
        }),
    updateFormState: protectedProcedure
        .input(z.object({
            formState: formStateSchema,
            formId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await ctx.db.form.update({
                    data: {
                        formData: input.formState,
                    },
                    where: {
                        formId: input.formId,
                    }
                })
                return result;
            }
            catch (error) {
                handleError(error as Error, "fail to update the formData");
            }
        })

});