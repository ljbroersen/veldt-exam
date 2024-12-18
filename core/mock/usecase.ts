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

  async createToDoDef(newToDo: ToDoDef): Promise<ToDoDef> {
    try {
      return await this.repository.createToDoDef(newToDo);
    } catch (error) {
      this.error(error);
      throw error;
    }
  }

  async updateToDoDef(id: number, updatedToDo: ToDoDef): Promise<ToDoDef> {
    try {
      return await this.repository.updateToDoDef(id, updatedToDo);
    } catch (error) {
      this.error(error);
      throw error;
    }
  }

  async updateToDoStatus(id: number, status: string): Promise<ToDoDef> {
    try {
      return await this.repository.updateToDoStatus(id, status);
    } catch (error) {
      this.error(error);
      throw error;
    }
  }

  async deleteToDoDef(id: number, deletedToDo: any): Promise<ToDoDef> {
    try {
      return await this.repository.deleteToDoDef(id, deletedToDo);
    } catch (error) {
      this.error(error);
      throw error;
    }
  }
}
