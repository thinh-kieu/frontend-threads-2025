export enum Role {
  Admin = 'admin',
  User = 'user',
}

export type User = {
  userId: string;
  username: string;
  role: string;
};
