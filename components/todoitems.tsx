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

  const isApproachingDeadline = (deadline: string | null | undefined) => {
    if (!deadline) return false;

    const deadlineTime = new Date(deadline).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = deadlineTime - currentTime;
    return timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000;
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

  const completedItems = data.filter(
    (attr: any) => attr.status === "completed"
  );
  const incompleteItems = data.filter(
    (attr: any) => attr.status === "incomplete"
  );

  const renderToDoItems = (data: any[]) => {
    return data.map((attr: any, index: number) => (
      <div
        className={`flex flex-row items-center gap-x-3 w-full ${
          isApproachingDeadline(attr.deadline) ? "bg-red-100" : "bg-white"
        }`}
        key={index}
      >
        <div className="flex flex-row items-center justify-between px-5 py-3 ring-inset rounded-xl w-full">
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
            <p className="truncate max-w-[60%]">{attr.title}</p>
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
    ));
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto space-y-4">
      <section>
        <h2 className="text-lg font-bold mb-2">Incomplete Tasks</h2>
        {incompleteItems.length > 0 ? (
          renderToDoItems(incompleteItems)
        ) : (
          <p>You completed all your tasks!</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">Completed Tasks</h2>
        {completedItems.length > 0 ? (
          renderToDoItems(completedItems)
        ) : (
          <p>No completed tasks</p>
        )}
      </section>

      {isDialogOpen && selectedTodo && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseDialog();
          }}
        >
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
