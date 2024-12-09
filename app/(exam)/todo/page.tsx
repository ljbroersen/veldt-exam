"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useUsecases } from "@/context/usecase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
// import Add from "@/components/add";

export default function Page() {
  const { mockUsecase } = useUsecases();
  const { data, isPending, isError } = useQuery({
    queryKey: ["todo-def"],
    queryFn: () => mockUsecase.fetchToDoDef(), // this is the data
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (isPending) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p>Error: {isError}</p>;
  }

  if (!data || data.length === 0) {
    return <p>Data: Not Found</p>;
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto space-y-2">
      {/* Header with Dialog for Add */}
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-bold text-gray-900 leading-8">
          ToDo items
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="flex items-center justify-center leading-none"
            >
              {/* TODO: Add ToDo item component should come here */}+
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New ToDo Item</DialogTitle>
              <DialogDescription>
                Use this form to add a new ToDo item to your list.
              </DialogDescription>
            </DialogHeader>
            <span>This is a test</span>
            {/* <Add /> */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {data.map((attr: any, index: number) => (
        <div className="flex flex-row items-center gap-x-3 w-full" key={index}>
          <div className="flex flex-row items-center justify-between px-5 py-3 ring-inset rounded-xl bg-white w-full">
            <div className="flex flex-row items-center gap-x-3">
              <Checkbox />
              <p>{attr.title}</p>
              <Badge variant="outline">{attr.status}</Badge>
            </div>
            <Button variant="plainBlack" size="sm">
              {/* TODO: Find a svg for the edit button */}
              Edit
            </Button>
          </div>
          <Button variant="plainRed" size="sm">
            x
          </Button>
        </div>
      ))}
    </div>
  );
}
