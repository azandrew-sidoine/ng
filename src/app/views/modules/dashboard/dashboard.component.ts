import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VIEW_DIRECTIVES } from '../../directives/view';

@Component({
    imports: [CommonModule, ...VIEW_DIRECTIVES],
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    @Input() name: string = 'Dashboard';
}
