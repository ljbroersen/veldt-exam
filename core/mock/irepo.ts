export interface IMockRepository {
  fetchToDoDef(): Promise<any>;
  createToDoDef(newToDo: any): Promise<any>;
  updateToDoDef(id: number, updatedToDo: any): Promise<any>;
  updateToDoStatus(id: number, status: string): Promise<any>;
  deleteToDoDef(id: number, deletedToDo: any): Promise<any>;
}
