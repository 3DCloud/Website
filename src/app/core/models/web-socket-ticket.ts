import { User } from './user';

export interface WebSocketTicket {
  id: string;
  user: User;
  ticket: string;
  expiresAt: Date;
}
