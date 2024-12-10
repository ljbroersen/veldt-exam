import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function App() {
  const methods = useForm();
  const { control, handleSubmit, formState } = methods;

  const onSubmit = (data: any) => {
    console.log("Form Data Submitted:", data);
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
              <Input {...field} id="title" placeholder="Enter a title" />
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
              />
            </FormControl>
          </>
        )}
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
