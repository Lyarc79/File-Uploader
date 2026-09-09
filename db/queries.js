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

  async function getFolders(userId) {
    const folders = await prisma.folder.findMany({
      where: { userId: userId },
    });
  }
  return folders;
}

async function updateFolderName(name, id) {
  const folder = await prisma.folder.update({
    where: { id: id },
    data: { name: name },
  });
}

async function deleteFolder(id) {
  const folder = await prisma.folder.delete({
    where: { id: id },
  });
}

module.exports = {
  getUserByIdentifier,
  getUserById,
  createUser,
  createFolder,
  getFolders,
  updateFolderName,
  deleteFolder,
};
