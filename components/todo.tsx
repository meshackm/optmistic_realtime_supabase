"use client";

import { addTodo } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { todo } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useOptimistic } from "react";

const Todo = ({ serverTodos }: any) => {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    serverTodos,
    (state, newTodo) => {
      return [...state, newTodo];
    }
  );

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "todo",
        },
        (payload) => addOptimisticTodo([...optimisticTodos, payload.new])
      )
      .subscribe();
  }, [serverTodos, optimisticTodos, addOptimisticTodo]);

  return (
    <div className="flex items-center justify-center flex-col gap-y-10 mt-10">
      <form
        action={async (formData: FormData) => {
          let content = formData.get("todo");
          addOptimisticTodo({
            id: Math.random().toString(),
            content: content as string,
          });

          await addTodo(formData);
        }}
      >
        <input type="text" name="todo" className="text-black" />
        <button type="submit">Add</button>
      </form>

      <ul className="list-none flex gap-2 flex-col ">
        {optimisticTodos?.map((todo: todo) => (
          <>
            {todo && (
              <li className="bg-slate-500 p-2" key={todo.id}>
                {todo.content}
              </li>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
