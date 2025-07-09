import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PIPES } from './pipes';

@Component({
  standalone: true,
  imports: [CommonModule, ...PIPES],
  selector: 'ngx-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.scss'],
})
export class EmbedComponent {
  // #region Component inputs
  @Input() url!: string | null | undefined;
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() title!: string;
  // #endregion Component inputs
}
