export interface IUser {
  id: string | null;
  email: string | null;
  username: string | null;
  isAdmin: boolean | null;
  token: string | null;
  picture: string | null;
  type: string;
}

export interface IAuth {
  user: IUser | null;
}
