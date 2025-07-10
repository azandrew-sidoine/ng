import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ngx-sidepane',
  templateUrl: './sidepane.component.html',
  styleUrl: './sidepane.component.scss',
  animations: [
    trigger('animate', [
      state(
        'true',
        style({
          visibility: 'visible',
          transform: 'translateX({{ true_translation }})',
        }),
        {
          params: { true_translation: '0' },
        }
      ),
      state(
        'false',
        style({
          visibility: 'hidden',
          '-webkit-backface-visibility': 'hidden',
          '-moz-backface-visibility': 'hidden',
          'backface-visibility': 'hidden',
          transform: 'translateX({{ false_translation }})',
        }),
        {
          params: { false_translation: '100%' },
        }
      ),
      transition('false => true', [animate('400ms ease-in')]),
      transition('true => false', [animate('400ms ease')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidepaneComponent {
  @Input() opened: boolean = false;
  @Input() position: 'left' | 'right' = 'right';

  @Output() openedChange = new EventEmitter<boolean>();

  // constructor(@Optional() private cdRef: ChangeDetectorRef | null) {}

  onClose(e: Event) {
    this.opened = false;
    this.openedChange.emit(false);
    e.preventDefault();
  }

  onClickOverlay(e: Event) {
    this.opened = false;
    this.openedChange.emit(false);
    e.preventDefault();
  }

  onClickPane(e: Event) {
    // stop event propagation to prevent click
    // event to occur on overlay component
    e.preventDefault();
    e.stopPropagation();
  }
}
