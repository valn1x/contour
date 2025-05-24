import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import type {
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import ParanoidModel from "./base/ParanoidModel";
import Collection from "./Collection";
import User from "./User";

@Table({ tableName: "folders", modelName: "folder" })
class Folder extends ParanoidModel<
  InferAttributes<Folder>,
  Partial<InferCreationAttributes<Folder>>
> {
  @Column
  name: string;

  @BelongsTo(() => Collection, "collectionId")
  collection: Collection;

  @ForeignKey(() => Collection)
  @Column(DataType.UUID)
  collectionId: string;

  @BelongsTo(() => Folder, "parentFolderId")
  parentFolder: Folder | null;

  @ForeignKey(() => Folder)
  @Column(DataType.UUID)
  parentFolderId: string | null;

  @BelongsTo(() => User, "createdById")
  createdBy: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  createdById: string;

  @HasMany(() => Folder, "parentFolderId")
  subfolders: Folder[];
}

export default Folder;
