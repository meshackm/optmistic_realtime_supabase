"use client";

import { addTodo } from "@/app/actions";
import React, { useState } from "react";
import { useOptimistic } from "react";

type Todo = {
  id: string;
  content: string;
};

type TodoComponentProps = {
  todos: Todo[];
};

const Todo = ({ todos }: TodoComponentProps) => {
  const [todo, setTodo] = useState("");
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => {
      return [...state, newTodo];
    }
  );

  return (
    <div className="flex items-center justify-center flex-col gap-y-10 mt-10">
      <form
        action={async (formData: FormData) => {
          addOptimisticTodo({
            id: Math.random().toString(),
            content: (todo as string) + "...optimistic",
          });

          await addTodo(formData);
        }}
      >
        <input
          value={todo}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTodo(e.target.value);
          }}
          type="text"
          name="todo"
          className="text-black"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="list-disc">
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
