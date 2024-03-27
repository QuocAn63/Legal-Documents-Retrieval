export interface IAuth {
  user: IUser | null;
  success: boolean;
  loading: boolean;
  error: string | null;
}
