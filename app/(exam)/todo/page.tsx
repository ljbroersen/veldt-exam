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

export default function Page() {
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto space-y-2">
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
            <Add />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ToDoItems />
    </div>
  );
}
