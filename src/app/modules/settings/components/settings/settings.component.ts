import { Component } from '@angular/core';

import { AbilitySubject } from 'app/core/models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public pages: { name: string; path: string; ability: AbilitySubject }[] = [
    { name: 'General', path: 'general', ability: 'GeneralSetting' },
    {
      name: 'Printer Definitions',
      path: 'printer-status-definitions',
      ability: 'PrinterDefinition',
    },
    { name: 'Materials', path: 'materials', ability: 'Material' },
  ];
}
