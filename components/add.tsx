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
      queryClient.setQueryData(["todo-def"], (old: any) => {
        return [...(old || []), newToDo];
      });
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
    return <p>Error loading tasks</p>;
  }

  const { control, handleSubmit, formState } = methods;

  const onSubmit = (data: any) => {
    createToDoDef(data);
  };

  return (
    <FormProvider {...methods}>
      <MyForm
        control={control}
        handleSubmit={handleSubmit}
        formState={formState}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
}

function MyForm({ control, handleSubmit, formState, onSubmit }: any) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        name="title"
        control={control}
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
            {formState.errors.title && (
              <FormMessage>{formState.errors.title?.message}</FormMessage>
            )}
          </>
        )}
      />

      <FormField
        name="description"
        control={control}
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
        control={control}
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
              />
            </FormControl>
            {formState.errors.deadline && (
              <FormMessage>{formState.errors.deadline?.message}</FormMessage>
            )}
          </>
        )}
      />

      <Button variant="default" size="lg" type="submit">
        Submit
      </Button>
    </form>
  );
}
