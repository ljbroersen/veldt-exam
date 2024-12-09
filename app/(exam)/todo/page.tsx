"use client";

import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { useUsecases } from "@/context/usecase";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-row justify-between items-center">
        <h2>ToDo items</h2>
        <Button variant="default" size="icon">
          {/* TODO: Add ToDo item component should come here */}+
        </Button>
      </div>
      {data.map((attr: any, index: number) => (
        <div
          className="flex flex-row items-center gap-x-3 justify-between w-full px-5 py-3 ring-inset rounded-xl bg-white"
          key={index}
        >
          <div className="flex flex-row items-center gap-x-3">
            <Checkbox />
            <p>{attr.title}</p>
            <Badge variant="outline">{attr.status}</Badge>
          </div>
          {/* TODO: This should be a variant on the Button component */}
          <Button variant="plainRed" size="sm">
            x
          </Button>
        </div>
      ))}
    </div>
  );
}
