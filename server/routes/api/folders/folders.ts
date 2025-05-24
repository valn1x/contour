import Router from "koa-router";
import auth from "@server/middlewares/authentication";
import { transaction } from "@server/middlewares/transaction";
import validate from "@server/middlewares/validate";
import { Folder, Collection } from "@server/models";
import { authorize } from "@server/policies";
import { presentPolicies } from "@server/presenters";
import presentFolder from "@server/presenters/folder";
import { APIContext } from "@server/types";
import * as T from "./schema";

const router = new Router();

router.post(
  "folders.create",
  auth(),
  validate(T.FoldersCreateSchema),
  transaction(),
  async (ctx: APIContext<T.FoldersCreateReq>) => {
    const { name, collectionId, parentFolderId } = ctx.input.body;
    const { user } = ctx.state.auth;
    const { transaction } = ctx.state;

    const collection = await Collection.findByPk(collectionId, {
      rejectOnEmpty: true,
    });
    authorize(user, "update", collection);

    const folder = await Folder.createWithCtx(ctx, {
      name,
      collectionId,
      parentFolderId,
      createdById: user.id,
    });

    ctx.body = {
      data: presentFolder(folder),
      policies: presentPolicies(user, [folder]),
    };
  }
);

router.post(
  "folders.list",
  auth(),
  validate(T.FoldersListSchema),
  async (ctx: APIContext<T.FoldersListReq>) => {
    const { collectionId, parentFolderId } = ctx.input.body;
    const { user } = ctx.state.auth;

    const collection = await Collection.findByPk(collectionId, {
      rejectOnEmpty: true,
    });
    authorize(user, "read", collection);

    const folders = await Folder.findAll({
      where: { collectionId, parentFolderId },
      order: [["name", "ASC"]],
    });

    ctx.body = {
      data: folders.map(presentFolder),
      policies: presentPolicies(user, folders),
    };
  }
);

export default router;
