import {User} from './user';

export class LeaveRequest {
  id: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: number;
  user: User;
}
