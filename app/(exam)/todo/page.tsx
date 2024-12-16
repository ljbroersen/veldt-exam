"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Add from "@/components/add";
import ToDoItems from "@/components/todoitems";
import { useState } from "react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto space-y-2">
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <h2 className="font-bold leading-8">ToDo items</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="flex items-center justify-center leading-none"
              aria-label="add new"
              onClick={handleOpenDialog}
            >
              +
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New ToDo Item</DialogTitle>
              <DialogDescription>
                Use this form to add a new ToDo item to your list.
              </DialogDescription>
            </DialogHeader>
            <Add onClose={handleCloseDialog} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" onClick={handleCloseDialog}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* The ToDo Items getting fetched in a separate component */}
      <ToDoItems />
    </div>
  );
}
