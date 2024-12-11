import { todoRes } from "@/tests/mock";

export class MockGateway {
  async fetchToDoDef(): Promise<any> {
    const res = todoRes;
    return res as any;
  }

  async createToDoDef(newToDo: any): Promise<any> {
    const now = new Date().toISOString();
    const newId = todoRes.length > 0 ? todoRes[todoRes.length - 1].id + 1 : 1;

    const todo = {
      id: newId,
      ...newToDo,
      status: "incomplete",
      created_at: now,
      updated_at: now,
    };

    return todo;
  }
}
