import { Badge } from "@/components/ui/badge";

// A detailed overview of a ToDo Item, after you clicked on the "..."
export default function ToDoItemDetails({ todo }: any) {
  if (!todo) return null;

  return (
    <div className="space-y-4">
      <div className="border-l-8 pl-3">
        <h2>{todo.title}</h2>
        <Badge variant="outline" className="mt-2" aria-label="status item">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${
              todo.status === "completed" ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {todo.status}
        </Badge>
        <p className="mt-3 break-words whitespace-pre-wrap">
          {todo.description}
        </p>
      </div>

      <div>
        <p className="font-semibold font-black">Deadline</p>
        <p className="">
          {todo.deadline
            ? new Date(todo.deadline).toLocaleString().slice(0, -3)
            : "No deadline"}
        </p>
      </div>
    </div>
  );
}
