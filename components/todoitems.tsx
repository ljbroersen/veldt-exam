"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import Edit from "@/components/edit";
import { useUsecases } from "@/context/usecase";
import { useState } from "react";

export default function ToDoItems() {
  const { mockUsecase } = useUsecases();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["todo-def"],
    queryFn: () => mockUsecase.fetchToDoDef(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: (payload: { id: number; status: string }) =>
      mockUsecase.updateToDoStatus(payload.id, payload.status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todo-def"] }),
  });

  const { mutate: deleteToDo } = useMutation({
    mutationFn: (id: number) => mockUsecase.deleteToDoDef(id, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todo-def"] }),
  });

  const toggleDialog = (todo?: any) => {
    if (todo) {
      setSelectedTodo(todo);
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTodo(null);
  };

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
    return <p>Error loading tasks</p>;
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto space-y-2">
      {data.map((attr: any, index: number) => (
        <div className="flex flex-row items-center gap-x-3 w-full" key={index}>
          <div className="flex flex-row items-center justify-between px-5 py-3 ring-inset rounded-xl bg-white w-full">
            <div className="flex flex-row items-center gap-x-3">
              <Checkbox
                checked={attr.status === "completed"}
                onCheckedChange={(checked) => {
                  toggleStatus({
                    id: attr.id,
                    status: checked ? "completed" : "incomplete",
                  });
                }}
              />
              <p>{attr.title}</p>
              <Badge variant="outline">{attr.status}</Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="plainBlack"
                size="sm"
                onClick={() => toggleDialog(attr)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteToDo(attr.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {isDialogOpen && selectedTodo && (
        <Dialog open={isDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit ToDo Item</DialogTitle>
              <DialogDescription>Edit your ToDo item.</DialogDescription>
            </DialogHeader>
            <Edit todo={selectedTodo} onClose={handleCloseDialog} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
