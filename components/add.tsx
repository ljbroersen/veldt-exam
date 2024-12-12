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

export default function Add() {
  const queryClient = useQueryClient();
  const { mockUsecase } = useUsecases();

  const { mutate: createToDoDef, isError } = useMutation({
    mutationFn: (newToDo: any) => mockUsecase.createToDoDef(newToDo),
    onSuccess: (newToDo) => {
      queryClient.setQueryData(["todo-def"], (old: any) => [
        ...(old || []),
        newToDo,
      ]);
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
  });

  if (isError) {
    return <p>Error creating task</p>;
  }

  const onSubmit = (data: any) => {
    createToDoDef(data);
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
                  value={field.value || ""}
                />
              </FormControl>
              {methods.formState.errors.title && (
                <FormMessage>
                  {methods.formState.errors.title?.message}
                </FormMessage>
              )}
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
                <Input
                  {...field}
                  id="description"
                  placeholder="Enter a description"
                  value={field.value || ""}
                />
              </FormControl>
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
              {methods.formState.errors.deadline && (
                <FormMessage>
                  {methods.formState.errors.deadline?.message}
                </FormMessage>
              )}
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
