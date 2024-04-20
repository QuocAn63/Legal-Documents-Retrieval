import { IUser } from "../models/users";

type UserDataSource = IUser & { key: string };

export const userDataSource: UserDataSource[] = [
  {
    id: "123",
    key: "123",
    username: "caoan632002",
    createdAt: "20/04/2024 2:05",
  },
  {
    id: "124",
    key: "124",
    email: "caoan632002@gmail.com",
    createdAt: "20/04/2024 2:05",
  },
];
