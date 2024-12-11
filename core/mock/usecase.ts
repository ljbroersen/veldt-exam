import { IMockRepository } from "./irepo";
import { ToDoDef } from "./type";

export class MockUsecase {
  private repository: IMockRepository;
  private error: (error: any) => void;

  constructor(repository: IMockRepository, error: (error: any) => void) {
    this.repository = repository;
    this.error = error;
  }

  async fetchToDoDef(): Promise<ToDoDef> {
    try {
      return await this.repository.fetchToDoDef();
    } catch (error) {
      this.error(error);
      throw error;
    }
  }

  async createToDoDef(newToDo: any): Promise<any> {
    try {
      return await this.repository.createToDoDef(newToDo);
    } catch (error) {
      this.error(error);
      throw error;
    }
  }
}
