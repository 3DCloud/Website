import { Ability, AbilityClass } from '@casl/ability';

export type AbilitySubject =
  | 'Client'
  | 'CancellationReason'
  | 'Device'
  | 'GCodeSettings'
  | 'GeneralSetting'
  | 'Material'
  | 'MaterialColor'
  | 'Print'
  | 'Printer'
  | 'PrinterDefinition'
  | 'PrinterExtruder'
  | 'UltiGCodeSettings'
  | 'UploadedFile'
  | 'User'
  | 'WebSocketTicket';

export type AbilityAction = 'create' | 'read' | 'update' | 'delete' | 'cancel';

export type UserAbility = Ability<
  [AbilityAction, AbilitySubject],
  Record<PropertyKey, unknown>
>;
export const UserAbility = Ability as AbilityClass<UserAbility>;
