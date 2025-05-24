import Folder from "@server/models/Folder";

export default function presentFolder(folder: Folder) {
  return {
    id: folder.id,
    name: folder.name,
    collectionId: folder.collectionId,
    parentFolderId: folder.parentFolderId,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}
