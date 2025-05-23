import {
  Table,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  BelongsTo,
  IsUUID,
  Unique,
  HasMany,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes, FindOptions } from "sequelize";
import slugify from "@shared/utils/slugify";
import { NavigationNode, NavigationNodeType } from "@shared/types";
import { generateUrlId } from "@server/utils/url";
import ParanoidModel from "./base/ParanoidModel";
import Collection from "./Collection";
import Team from "./Team";
import User from "./User";

@DefaultScope(() => ({
  where: {
    deletedAt: null,
  },
}))
@Table({ tableName: "folders", modelName: "folder" })
class Folder extends ParanoidModel<
  InferAttributes<Folder>,
  InferCreationAttributes<Folder>
> {
  @Column
  title: string;

  @Unique
  @Column
  urlId: string;

  @IsUUID(4)
  @ForeignKey(() => Folder)
  @Column(DataType.UUID)
  parentFolderId?: string | null;

  @BelongsTo(() => Folder, "parentFolderId")
  parentFolder?: Folder | null;

  @HasMany(() => Folder, "parentFolderId")
  children?: Folder[];

  @IsUUID(4)
  @ForeignKey(() => Collection)
  @Column(DataType.UUID)
  collectionId!: string;

  @BelongsTo(() => Collection)
  collection!: Collection;

  @IsUUID(4)
  @ForeignKey(() => Team)
  @Column(DataType.UUID)
  teamId!: string;

  @BelongsTo(() => Team)
  team!: Team;

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  createdById!: string;

  @BelongsTo(() => User, "createdById")
  createdBy!: User;

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  updatedById!: string;

  @BelongsTo(() => User, "updatedById")
  updatedBy!: User;

  get url() {
    return Folder.getPath({ title: this.title, urlId: this.urlId });
  }

  static getPath({ title, urlId }: { title: string; urlId: string }) {
    const slugifiedTitle = slugify(title);
    if (!slugifiedTitle) {
      return `/folder/untitled-${urlId}`;
    }
    return `/folder/${slugifiedTitle}-${urlId}`;
  }

  static beforeCreate(folder: Folder) {
    folder.urlId = folder.urlId || generateUrlId();
  }

  async toNavigationNode(options?: FindOptions<Folder>): Promise<NavigationNode> {
    const childFolders = await (this.constructor as typeof Folder).findAll({
      where: { parentFolderId: this.id },
      transaction: options?.transaction,
    });

    const children = await Promise.all(
      childFolders.map((child) => child.toNavigationNode(options))
    );

    return {
      id: this.id,
      title: this.title,
      url: this.url,
      children,
      type: NavigationNodeType.Folder,
    };
  }
}

export default Folder;
