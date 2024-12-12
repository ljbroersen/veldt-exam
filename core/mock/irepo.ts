export interface IMockRepository {
  fetchToDoDef(): Promise<any>;
  createToDoDef(newToDo: any): Promise<any>;
  updateToDoStatus(id: number, status: string): Promise<any>;
}
