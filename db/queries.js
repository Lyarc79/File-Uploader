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

module.exports = {
  getUserByIdentifier,
  getUserById,
};
