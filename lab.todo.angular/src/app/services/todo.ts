export interface Todo {
    id: number;
    content: string;
    userCreated: string;
    createAt: string;
}

export const TODOS: Todo[] = [
    {
        id: 1,
        content: "Nghiên cứu framwork Angular",
        userCreated: "vinh 1",
        createAt: "2022.11.11"
    },
    {
        id: 2,
        content: "Nghiên cứu Ant Design",
        userCreated: "vinh 2",
        createAt: "2022.11.12"
    },
    {
        id: 3,
        content: "Viết báo cáo",
        userCreated: "vinh 3",
        createAt: "2022.11.13"
    },
    {
        id: 4,
        content: "Viết luận án",
        userCreated: "vinh 4",
        createAt: "2022.11.14"
    }
]