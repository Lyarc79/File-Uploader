const prisma = require("../lib/prisma");

async function getUserByIdentifier(identifier) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });
  return user;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  return user;
}

async function createUser(username, email, hashedPassword) {
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
    },
  });
}

async function createFolder(name, userId) {
  const folder = await prisma.folder.create({
    data: {
      name: name,
      userId: userId,
    },
  });
}

async function getFolders(userId) {
  const folders = await prisma.folder.findMany({
    where: { userId: userId },
  });
  return folders;
}

async function updateFolderName(name, id) {
  const folder = await prisma.folder.update({
    where: { id: Number(id) },
    data: { name: name },
  });
}

async function deleteFolder(id) {
  const folder = await prisma.folder.delete({
    where: { id: Number(id) },
  });
}

async function getFolderById(id) {
  const folder = await prisma.folder.findUnique({
    where: { id: Number(id) },
    include: { files: true },
  });
  return folder;
}

async function uploadFile(filePath, originalname, size, folderId, userId) {
  const file = await prisma.file.create({
    data: {
      name: originalname,
      path: filePath,
      size: size,
      folderId: folderId || null,
      userId: userId,
    },
  });
}

async function getRootFiles(userId) {
  return await prisma.file.findMany({
    where: {
      userId: userId,
      folderId: null,
    },
  });
}

async function deleteFile(id) {
  return await prisma.file.delete({
    where: { id: Number(id) },
  });
}

async function getFileById(id) {
  return await prisma.file.findUnique({
    where: { id: Number(id) },
  });
}

// Dup names helper
async function evaluateDupFiles(fileName, userId, folderId) {
  const splitedName = fileName.split(".");
  let match = await prisma.file.findFirst({
    where: {
      userId: userId,
      folderId: folderId || null,
      name: fileName,
    },
  });
  let counter = 1;
  let finalName = fileName;
  while (match) {
    const dupFile = `${splitedName[0]}(${counter}).${splitedName[1]}`;
    const newMatch = await prisma.file.findFirst({
      where: {
        userId: userId,
        folderId: folderId || null,
        name: dupFile,
      },
    });
    finalName = dupFile;
    match = newMatch;
    counter++;
  }
  return finalName;
}

module.exports = {
  getUserByIdentifier,
  getUserById,
  createUser,
  createFolder,
  getFolders,
  updateFolderName,
  deleteFolder,
  getFolderById,
  uploadFile,
  getRootFiles,
  deleteFile,
  getFileById,
  evaluateDupFiles,
};
