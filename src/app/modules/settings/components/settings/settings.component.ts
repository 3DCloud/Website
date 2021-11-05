import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public pages: { name: string; path: string }[] = [
    { name: 'General', path: 'general' },
    { name: 'Printer Definitions', path: 'printer-definitions' },
    { name: 'Materials', path: 'materials' },
  ];
}
