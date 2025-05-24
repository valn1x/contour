import { observable } from "mobx";
import { NavigationNode, NavigationNodeType } from "@shared/types";
import Collection from "./Collection";
import Document from "./Document";
import ParanoidModel from "./base/ParanoidModel";
import Field from "./decorators/Field";
import Relation from "./decorators/Relation";

export default class Folder extends ParanoidModel {
  static modelName = "Folder";

  @Field
  @observable
  name: string;

  @Field
  @observable
  collectionId: string;

  @Field
  @observable
  parentFolderId?: string | null;

  @Relation(() => Collection, { onDelete: "cascade" })
  collection?: Collection;

  @Relation(() => Folder, { onDelete: "cascade" })
  parentFolder?: Folder;

  @Relation(() => Document, { ttl: Infinity })
  documents: Document[];

  get asNavigationNode(): NavigationNode {
    return {
      id: this.id,
      title: this.name,
      url: "",
      children: [],
      type: NavigationNodeType.Folder,
    };
  }
}
