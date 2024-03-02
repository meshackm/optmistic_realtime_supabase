"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/prisma";

export async function addTodo(formData: FormData) {
  const todo = formData.get("todo");
  try {
    await prisma.todo.create({
      data: {
        content: todo as string,
      },
    });
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/");
}
