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

module.exports = {
  getUserByIdentifier,
  getUserById,
};
