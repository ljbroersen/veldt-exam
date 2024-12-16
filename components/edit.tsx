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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "./ui/textarea";

type EditProps = {
  todo: any;
  onClose: () => void;
};

// Validation and error handling
const schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
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
  updated_at: yup.date().default(() => new Date()),
});

export default function Edit({ todo, onClose }: EditProps) {
  const queryClient = useQueryClient();
  const { mockUsecase } = useUsecases();

  // Logic behind changing a ToDo Item
  const { mutate: updateToDoDef, isError } = useMutation({
    mutationFn: (updatedToDo: any) =>
      mockUsecase.updateToDoDef(todo.id, updatedToDo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-def"] });
      onClose();
    },
  });

  const formatDeadline = (date: string | null | undefined): string | null => {
    if (!date) return null;
    const parsedDate = new Date(date);
    return parsedDate.toISOString().slice(0, 16);
  };

  const methods = useForm({
    defaultValues: {
      title: todo.title,
      description: todo.description,
      deadline: formatDeadline(todo.deadline),
      updated_at: new Date(),
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    methods.reset({
      title: todo.title,
      description: todo.description,
      deadline: formatDeadline(todo.deadline),
      updated_at: new Date(),
    });
  }, [todo]);

  // When the ToDo Item couldn't be updated correctly
  if (isError) {
    return <p>Error updating ToDoItem</p>;
  }

  // Logic behind submitting the data
  const onSubmit = (data: any) => {
    updateToDoDef(data);
  };

  return (
    // The form with separate input/text fields for Title, Description, Deadline
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={methods.control}
          render={({ field }) => (
            <>
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
                  placeholder="Edit the title"
                  value={field.value}
                  maxLength={16}
                />
              </FormControl>
            </>
          )}
        />

        <FormField
          name="description"
          control={methods.control}
          render={({ field }) => (
            <>
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
                  placeholder="Edit the description"
                  value={field.value}
                  rows={4}
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
              <div className="flex flex-column justify-between items-center">
                <FormLabel htmlFor="deadline">Deadline</FormLabel>
                <FormMessage>
                  {methods.formState.errors.deadline?.message}
                </FormMessage>
              </div>

              <FormControl>
                <Input
                  {...field}
                  id="deadline"
                  type="datetime-local"
                  placeholder="Edit the deadline"
                  value={formatDeadline(field.value) || ""}
                  className="w-min"
                />
              </FormControl>
            </>
          )}
        />

        <Button
          variant="default"
          size="lg"
          type="submit"
          aria-label="submit change"
        >
          Change
        </Button>
      </form>
    </FormProvider>
  );
}
