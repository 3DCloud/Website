import { SubjectRawRule } from '@casl/ability';

import { AbilityAction, AbilitySubject } from './user-ability';

export type AbilityRule = SubjectRawRule<
  AbilityAction,
  AbilitySubject,
  Record<PropertyKey, unknown>
>;
