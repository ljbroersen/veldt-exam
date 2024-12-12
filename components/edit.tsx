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
import { useEffect } from "react";

type EditProps = {
  todo: any;
  onClose: () => void;
};

export default function Edit({ todo, onClose }: EditProps) {
  const queryClient = useQueryClient();
  const { mockUsecase } = useUsecases();

  const { mutate: updateToDoDef, isError } = useMutation({
    mutationFn: (updatedToDo: any) =>
      mockUsecase.updateToDoDef(todo.id, updatedToDo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-def"] });
      onClose();
    },
  });

  const formatDeadline = (date: string | null) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return parsedDate.toISOString().slice(0, 16);
  };

  const methods = useForm({
    defaultValues: {
      title: todo.title || "",
      description: todo.description || "",
      deadline: formatDeadline(todo.deadline) || "",
      updated_at: new Date(),
    },
  });

  useEffect(() => {
    methods.reset({
      title: todo.title || "",
      description: todo.description || "",
      deadline: formatDeadline(todo.deadline) || "",
      updated_at: new Date(),
    });
  }, [todo]);

  if (isError) {
    return <p>Error updating task</p>;
  }

  const onSubmit = (data: any) => {
    updateToDoDef(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={methods.control}
          render={({ field, fieldState }) => (
            <>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="title"
                  placeholder="Edit the title"
                  value={field.value || ""}
                />
              </FormControl>
              {fieldState.error?.message && (
                <FormMessage>{String(fieldState.error.message)}</FormMessage>
              )}
            </>
          )}
        />

        <FormField
          name="description"
          control={methods.control}
          render={({ field, fieldState }) => (
            <>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="description"
                  placeholder="Edit the description"
                  value={field.value || ""}
                />
              </FormControl>
              {fieldState.error?.message && (
                <FormMessage>{String(fieldState.error.message)}</FormMessage>
              )}
            </>
          )}
        />

        <FormField
          name="deadline"
          control={methods.control}
          render={({ field, fieldState }) => (
            <>
              <FormLabel htmlFor="deadline">Deadline</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="deadline"
                  type="datetime-local"
                  placeholder="Edit the deadline"
                  value={formatDeadline(field.value)}
                  className="w-min"
                />
              </FormControl>
              {fieldState.error?.message && (
                <FormMessage>{String(fieldState.error.message)}</FormMessage>
              )}
            </>
          )}
        />

        <Button variant="default" size="lg" type="submit">
          Update
        </Button>
      </form>
    </FormProvider>
  );
}
