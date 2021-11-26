import { Print } from './print';

export interface CancellationReason {
  id: string;
  name: string;
  description: string;
  prints: Print[];
}
