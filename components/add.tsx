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

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required!")
    .max(16, "Title cannot be longer than 16 characters!"),
  description: yup.string().required("Description is required!"),
  deadline: yup
    .string()
    .nullable()
    .test("not-in-past", "Deadline cannot be in the past!", (value) => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const now = new Date();
      now.setSeconds(0, 0);
      return selectedDate >= now;
    }),
  created_at: yup.date().default(() => new Date()),
  updated_at: yup.date().default(() => new Date()),
});

export default function Add() {
  const queryClient = useQueryClient();
  const { mockUsecase } = useUsecases();

  const { mutate: createToDoDef, isError } = useMutation({
    mutationFn: (newToDo: any) => mockUsecase.createToDoDef(newToDo),
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-def"] });
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

  if (isError) {
    return <p>Error creating task</p>;
  }

  const onSubmit = (data: any) => {
    console.log("Submitting form data:", data);
    createToDoDef(data);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={methods.control}
          render={({ field }) => (
            <>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="title"
                  placeholder="Enter a title"
                  value={field.value}
                  maxLength={16}
                />
              </FormControl>
              <FormMessage>
                {methods.formState.errors.title?.message}
              </FormMessage>
            </>
          )}
        />

        <FormField
          name="description"
          control={methods.control}
          render={({ field }) => (
            <>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Enter a description"
                  value={field.value}
                  rows={4}
                />
              </FormControl>
              <FormMessage>
                {methods.formState.errors.description?.message}
              </FormMessage>
            </>
          )}
        />

        <FormField
          name="deadline"
          control={methods.control}
          render={({ field }) => (
            <>
              <FormLabel htmlFor="deadline">Deadline</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="deadline"
                  type="datetime-local"
                  placeholder="Select deadline"
                  value={field.value || ""}
                  className="w-min"
                />
              </FormControl>
              <FormMessage>
                {methods.formState.errors.deadline?.message}
              </FormMessage>
            </>
          )}
        />

        <Button variant="default" size="lg" type="submit">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
