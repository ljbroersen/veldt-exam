import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useUsecases } from "@/context/usecase";
import { useEffect, useState } from "react";
import Edit from "./edit";

export default function ToDoItems() {
  const { mockUsecase } = useUsecases();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [localData, setLocalData] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["todo-def"],
    queryFn: () => mockUsecase.fetchToDoDef(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      saveToLocalStorage(data);
      setLocalData(data);
    }
  }, [data]);

  useEffect(() => {
    const storedData = localStorage.getItem("todo-items");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setLocalData(parsedData);
      } catch (error) {
        console.error("Error parsing localStorage data", error);
      }
    }
  }, []);

  const saveToLocalStorage = (data: any[]) => {
    try {
      localStorage.setItem("todo-items", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  const { mutate: toggleStatus } = useMutation({
    mutationFn: (payload: { id: number; status: string }) =>
      mockUsecase.updateToDoStatus(payload.id, payload.status),
    onSuccess: (_, variables) => {
      const updatedData = localData.map((item) =>
        item.id === variables.id ? { ...item, status: variables.status } : item
      );
      setLocalData(updatedData);
      saveToLocalStorage(updatedData);
    },
  });

  const { mutate: deleteToDo } = useMutation({
    mutationFn: (id: number) => mockUsecase.deleteToDoDef(id, {}),
    onSuccess: (_, variables) => {
      const updatedData = localData.filter((item) => item.id !== variables);
      setLocalData(updatedData);
      saveToLocalStorage(updatedData);
    },
  });

  const toggleDialog = (todo?: any) => {
    if (todo) {
      setSelectedTodo(todo);
      setIsDialogOpen(true);
      setIsEditMode(false);
    } else {
      setIsDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTodo(null);
    setIsEditMode(false);
  };

  const isApproachingDeadline = (deadline: string | null | undefined) => {
    if (!deadline) return false;
    const deadlineTime = new Date(deadline).getTime();
    const currentTime = new Date().getTime();
    return (
      deadlineTime > currentTime &&
      deadlineTime - currentTime <= 24 * 60 * 60 * 1000
    );
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

  const renderToDoItems = (data: any[]) => {
    return data.map((attr: any, index: number) => (
      <div
        className={`flex flex-row items-center gap-x-3 my-2 w-full ${
          isApproachingDeadline(attr.deadline) ? "bg-red-100" : "bg-white"
        }`}
        key={index}
        aria-label="ToDo Item"
      >
        <div className="flex flex-row justify-between px-5 py-3 ring-inset w-full border-l-8">
          <div className="flex items-center">
            <Checkbox
              checked={attr.status === "completed"}
              onCheckedChange={(checked) => {
                toggleStatus({
                  id: attr.id,
                  status: checked ? "completed" : "incomplete",
                });
              }}
              aria-label="Checkbox to change status ToDo Item"
            />
          </div>

          <div className="flex flex-col flex-grow max-w-[60%]">
            <div className="flex flex-row items-center gap-x-2">
              <p className="truncate font-medium">{attr.title}</p>
              <Badge variant="outline" aria-label="Status of the ToDo Item">
                {attr.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{attr.description}</p>
          </div>

          <div className="flex flex-row items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleDialog(attr)}
              aria-label="View Details ToDo Item"
            >
              ...
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteToDo(attr.id)}
              aria-label="Delete ToDo Item"
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
        <h2
          className="text-lg font-bold mb-2"
          aria-label="Header for the section of incomplete Tasks"
        >
          Incomplete Tasks
        </h2>
        {localData.some((item) => item.status === "incomplete") ? (
          renderToDoItems(
            localData.filter((attr) => attr.status === "incomplete")
          )
        ) : (
          <p>You completed all your tasks!</p>
        )}
      </section>

      <section>
        <h2
          className="text-lg font-bold mb-2"
          aria-label="Header for the section of completed Tasks"
        >
          Completed Tasks
        </h2>
        {localData.some((item) => item.status === "completed") ? (
          renderToDoItems(
            localData.filter((attr) => attr.status === "completed")
          )
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
              <DialogTitle>
                {isEditMode ? "Edit ToDo Items" : "ToDo Item Details"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Here you can edit your ToDo Item"
                  : "Here you have a detailed overview of your ToDo Item"}
              </DialogDescription>
            </DialogHeader>

            {isEditMode ? (
              <Edit todo={selectedTodo} onClose={handleCloseDialog} />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Title:</p>
                  <p>{selectedTodo.title}</p>
                </div>
                <div>
                  <p className="font-semibold">Description:</p>
                  <p>{selectedTodo.description}</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <p>{selectedTodo.status}</p>
                </div>
                <div>
                  <p className="font-semibold">Deadline:</p>
                  <p>
                    {selectedTodo.deadline
                      ? new Date(selectedTodo.deadline).toLocaleString()
                      : "No deadline"}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              {!isEditMode && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </Button>
              )}
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
