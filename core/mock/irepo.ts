export interface IMockRepository {
  fetchToDoDef(): Promise<any>;
  createToDoDef(newToDo: any): Promise<any>;
}
