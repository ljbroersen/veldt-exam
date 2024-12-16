import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUsecases } from "@/context/usecase";
import { Button } from "./ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "./ui/textarea";
import { ToDoDef } from "@/core/mock/type";

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required!")
    .max(16, "Title cannot be longer than 16 characters!"),
  description: yup.string().required("Description is required!"),
  deadline: yup.string().nullable(),
  created_at: yup.date().default(() => new Date()),
  updated_at: yup.date().default(() => new Date()),
});

interface AddProps {
  onClose: () => void;
}

export default function Add({ onClose }: Readonly<AddProps>) {
  const queryClient = useQueryClient();
  const { mockUsecase } = useUsecases();

  const { mutate: createToDoDef, isError } = useMutation({
    mutationFn: (newToDo: ToDoDef) => mockUsecase.createToDoDef(newToDo),
    onMutate: async (newToDo) => {
      await queryClient.cancelQueries({ queryKey: ["todo-def"] });

      const previousToDos = queryClient.getQueryData(["todo-def"]);

      queryClient.setQueryData(["todo-def"], (old: any) => [
        ...(old || []),
        { ...newToDo, id: Date.now(), status: "incomplete" },
      ]);

      return { previousToDos };
    },
    onError: (context: any) => {
      queryClient.setQueryData(["todo-def"], context.previousToDos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-def"] });
      onClose();
    },
  });

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      created_at: new Date(),
      updated_at: new Date(),
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    createToDoDef(data);
    methods.reset();
  };

  if (isError) {
    return <p>Error creating ToDoItem</p>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={methods.control}
          render={({ field }) => (
            <div>
              <div className="flex flex-column justify-between items-center">
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormMessage>
                  {methods.formState.errors.title?.message}
                </FormMessage>
              </div>
              <FormControl>
                <Input
                  {...field}
                  id="title"
                  placeholder="Enter a title"
                  value={field.value}
                  maxLength={16}
                />
              </FormControl>
            </div>
          )}
        />

        <FormField
          name="description"
          control={methods.control}
          render={({ field }) => (
            <div>
              <div className="flex flex-column justify-between items-center">
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormMessage>
                  {methods.formState.errors.description?.message}
                </FormMessage>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Enter a description"
                  value={field.value}
                  rows={4}
                />
              </FormControl>
            </div>
          )}
        />

        <FormField
          name="deadline"
          control={methods.control}
          render={({ field }) => (
            <div>
              <div className="flex flex-column justify-between items-center mt-2">
                <FormLabel htmlFor="deadline">Deadline</FormLabel>
                <FormMessage>
                  {methods.formState.errors.deadline?.message}
                </FormMessage>
              </div>
              <div className="flex flex-column items-center">
                <FormControl>
                  <Input
                    {...field}
                    id="deadline"
                    type="datetime-local"
                    value={field.value ?? ""}
                    className="w-min"
                  />
                </FormControl>
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={() => methods.setValue("deadline", "")}
                  className="cursor-pointer ml-2"
                >
                  x
                </Button>
              </div>
            </div>
          )}
        />

        <Button
          variant="default"
          size="lg"
          type="submit"
          aria-label="submit new"
          className="mt-4"
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
