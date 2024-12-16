import { ToDoDef } from "./type";

export interface IMockRepository {
  fetchToDoDef(): Promise<ToDoDef>;
  createToDoDef(newToDo: ToDoDef): Promise<ToDoDef>;
  updateToDoDef(id: number, updatedToDo: ToDoDef): Promise<ToDoDef>;
  updateToDoStatus(id: number, status: string): Promise<ToDoDef>;
  deleteToDoDef(id: number, deletedToDo: ToDoDef): Promise<ToDoDef>;
}
