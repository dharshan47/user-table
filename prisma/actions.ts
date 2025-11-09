"use server";

import prisma from "@/lib/prisma";

export async function createUsers(data: {
  name: string;
  age: string;
  email: string;
  contact: string;
}) {
  const existingUser = await prisma.userTable.findFirst({
    where: {
      OR: [{ email: data.email }, { contact: data.contact }],
    },
  });
  if (existingUser) {
    return {
      error:
        existingUser.email === data.email
          ? "Email already exists!"
          : "Contact already exists!",
    };
  }
  return await prisma.userTable.create({
    data: {
      name: data.name,
      age: data.age,
      email: data.email,
      contact: data.contact,
    },
  });
}

export async function getUsers() {
  return await prisma.userTable.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUsers(data: {
  id: string;
  name: string;
  age: string;
  email: string;
  contact: string;
}) {
  return await prisma.userTable.update({
    where: { id: data.id },
    data,
  });
}

export async function deleteUsers(id: string) {
  return await prisma.userTable.delete({ where: { id } });
}
