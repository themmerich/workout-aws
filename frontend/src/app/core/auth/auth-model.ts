export type Role = 'admin' | 'user';

export interface CurrentUser {
  username: string;
  role: Role;
}
