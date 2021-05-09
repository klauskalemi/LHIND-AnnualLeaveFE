import {Role} from './role';

export class User {
  id: number;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  leaveRequests: any[];
  roles: Role[];
}
