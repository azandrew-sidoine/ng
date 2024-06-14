import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { VIEW_DIRECTIVES } from '../../directives/view';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ...VIEW_DIRECTIVES],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Input() name: string = 'Dashboard';

  constructor(private httpClient: HttpClient) {}

  async ngOnInit() {
    console.log(
      await lastValueFrom(
        this.httpClient.get(
          'https://siamu-api.lik.tg/api/adh/memberships?page=1&per_page=10'
        )
      )
    );
  }
}
