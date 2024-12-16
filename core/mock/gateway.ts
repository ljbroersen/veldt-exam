import { todoRes } from "@/tests/mock";
import { ToDoDef } from "./type";

export class MockGateway {
  async fetchToDoDef(): Promise<ToDoDef> {
    const res = todoRes;
    return res as any;
  }

  async createToDoDef(newToDo: any): Promise<ToDoDef> {
    const newId = todoRes.length > 0 ? todoRes[todoRes.length - 1].id + 1 : 1;

    const todo = {
      id: newId,
      ...newToDo,
      status: "incomplete",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    todoRes.push(todo);
    return todo;
  }

  async updateToDoDef(id: number, updatedFields: ToDoDef): Promise<ToDoDef> {
    const index = todoRes.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todoRes[index] = {
        ...todoRes[index],
        ...updatedFields,
        updated_at: new Date().toISOString(),
      };
    }
    return todoRes[index];
  }

  async updateToDoStatus(id: number, status: string): Promise<ToDoDef> {
    const index = todoRes.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todoRes[index].status = status;
    }
    return todoRes[index];
  }

  async deleteToDoDef(id: number): Promise<any> {
    const index = todoRes.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todoRes.splice(index, 1);
    }
    return { success: true };
  }
}
