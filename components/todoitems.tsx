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
import ToDoItemDetails from "./todoitems-details";

export default function ToDoItems() {
  const { mockUsecase } = useUsecases();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [localData, setLocalData] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Logic for fetching the initial mock data
  const { data, isPending, isError } = useQuery({
    queryKey: ["todo-def"],
    queryFn: () => mockUsecase.fetchToDoDef(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Logic behind local storage
  useEffect(() => {
    if (data) {
      handleSaveToLocalStorage(data);
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

  const handleSaveToLocalStorage = (data: any[]) => {
    try {
      localStorage.setItem("todo-items", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  // Logic behind changing the status of a ToDo Item
  const { mutate: toggleStatus } = useMutation({
    mutationFn: (toDoItem: { id: number; status: string }) =>
      mockUsecase.updateToDoStatus(toDoItem.id, toDoItem.status),
    onSuccess: (_, variables) => {
      const updatedData = localData.map((item) =>
        item.id === variables.id ? { ...item, status: variables.status } : item
      );
      setLocalData(updatedData);
      handleSaveToLocalStorage(updatedData);
    },
  });

  // Logic behind deleting a ToDo Item
  const { mutate: deleteToDo } = useMutation({
    mutationFn: (id: number) => mockUsecase.deleteToDoDef(id, {}),
    onSuccess: (_, variables) => {
      const updatedData = localData.filter((item) => item.id !== variables);
      setLocalData(updatedData);
      handleSaveToLocalStorage(updatedData);
    },
  });

  // Logic behind showing the right ToDo Item when clicking on the "..." button
  const handleToggleDialog = (todo?: any) => {
    if (todo) {
      setSelectedTodo(todo);
      setIsDialogOpen(true);
      setIsEditMode(false);
    } else {
      setIsDialogOpen(false);
    }
  };

  // Logic behind closing the Dialog that was opened with handleToggleDialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTodo(null);
    setIsEditMode(false);
  };

  // Logic to check if the deadline is within 24 hours of the current time
  const isApproachingDeadline = (deadline: string | null | undefined) => {
    if (!deadline) return false;
    const deadlineTime = new Date(deadline).getTime();
    const currentTime = new Date().getTime();
    return (
      deadlineTime > currentTime &&
      deadlineTime - currentTime <= 24 * 60 * 60 * 1000
    );
  };

  // While the ToDo Items are being rendered
  if (isPending) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  // When the ToDo Items couldn't be fetched correctly
  if (isError) {
    return <p>Error loading toDo Items</p>;
  }

  // renderToDoItems creates the compact, list-like version of each ToDo Item, sorted by Incomplete and Completed Tasks
  const renderToDoItems = (data: any[]) => {
    return data.map((attr: any, index: number) => (
      <div
        className={`flex flex-row items-center gap-x-3 my-2 w-full ${
          isApproachingDeadline(attr.deadline) ? "bg-red-100" : "bg-white"
        }`}
        key={index}
        aria-label="todo item"
      >
        <div className="flex flex-row justify-evenly py-3 ring-inset w-full border-l-8">
          <div className="flex items-center">
            <Checkbox
              checked={attr.status === "completed"}
              onCheckedChange={(checked) => {
                toggleStatus({
                  id: attr.id,
                  status: checked ? "completed" : "incomplete",
                });
              }}
              aria-label="change status item"
            />
          </div>

          <div className="flex flex-col flex-grow max-w-[60%]">
            <div className="flex flex-row items-center gap-x-2">
              <p className="truncate font-medium text-black">{attr.title}</p>
              <Badge variant="outline" aria-label="status item">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    attr.status === "completed" ? "bg-green-500" : "bg-red-500"
                  }`}
                  aria-hidden="true"
                ></span>
                {attr.status}
              </Badge>
            </div>
            <p>
              Deadline:{" "}
              {attr.deadline
                ? new Date(attr.deadline).toLocaleString().slice(0, -3)
                : "No deadline"}
            </p>
          </div>
          {/* Button to go to the detailed overview of a ToDo Item */}
          <div className="flex flex-row items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleDialog(attr)}
              aria-label="open details window"
            >
              ...
            </Button>
            {/* Button to delete a ToDo Item */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteToDo(attr.id)}
              aria-label="delete item"
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
        <h2 className="text-lg font-bold mb-2" aria-label="incomplete tasks">
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
        <h2 className="text-lg font-bold mb-2" aria-label="completed tasks">
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
              <ToDoItemDetails todo={selectedTodo} />
            )}

            <DialogFooter>
              {!isEditMode && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  aria-label="edit"
                >
                  Edit
                </Button>
              )}
              <DialogClose asChild>
                <Button variant="secondary" aria-label="close details window">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
