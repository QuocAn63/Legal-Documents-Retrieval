export interface IUser {
  id: string | null;
  email: string | null;
  username: string | null;
  isAdmin: boolean | null;
  accessToken: string | null;
}

export interface IAuth {
  user: IUser | null;
  success: boolean;
  loading: boolean;
  error: string | null;
}
