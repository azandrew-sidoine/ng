import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VIEW_DIRECTIVES } from '../../directives/view';

@Component({
    imports: [CommonModule, ...VIEW_DIRECTIVES],
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss']
})
export class ExampleComponent {}
