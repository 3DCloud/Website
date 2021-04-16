import { Component, OnDestroy, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { ClientsService } from '../services/clients.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {

  public loading = true;
  public error: any = null;
  public clients: Client[] = [];
  public busy = false;

  private subscriptions: Subscription[] = [];

  constructor(private clientsService: ClientsService) { }

  public ngOnInit(): void {
    this.subscriptions.push(this.clientsService.getClients().subscribe(clients => {
      this.clients = clients.slice();
      this.loading = false;
    }, error => {
      this.error = error;
      this.loading = false;
    }));
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public grantAuthorization(clientId: string): void {
    this.busy = true;

    this.subscriptions.push(this.clientsService.grantAuthorization(clientId).subscribe(client => {
      const index = this.clients.findIndex(c => c.id === clientId);

      if (index >= 0) {
        this.clients[index] = client;
      }
    }, error => {
      this.error = error;
    }).add(() => {
      this.busy = false;
    }));
  }

  public revokeAuthorization(clientId: string): void {
    this.busy = true;

    this.subscriptions.push(this.clientsService.revokeAuthorization(clientId).subscribe(client => {
      const index = this.clients.findIndex(c => c.id === clientId);

      if (index >= 0) {
        this.clients[index] = client;
      }
    }, error => {
      this.error = error;
    }).add(() => {
      this.busy = false;
    }));
  }

  public delete(id: string): void {
    this.busy = true;

    this.subscriptions.push(this.clientsService.delete(id).subscribe(() => {
      this.clients = this.clients.filter(c => c.id !== id);
    }, error => {
      this.error = error;
    }).add(() => {
      this.busy = false;
    }));
  }

}
