import { z } from "zod";
import { BaseSchema } from "../schema";

export const FoldersCreateSchema = BaseSchema.extend({
  body: z.object({
    name: z.string(),
    collectionId: z.string().uuid(),
    parentFolderId: z.string().uuid().nullable().optional(),
  }),
});
export type FoldersCreateReq = z.infer<typeof FoldersCreateSchema>;

export const FoldersListSchema = BaseSchema.extend({
  body: z.object({
    collectionId: z.string().uuid(),
    parentFolderId: z.string().uuid().nullable().optional(),
  }),
});
export type FoldersListReq = z.infer<typeof FoldersListSchema>;
