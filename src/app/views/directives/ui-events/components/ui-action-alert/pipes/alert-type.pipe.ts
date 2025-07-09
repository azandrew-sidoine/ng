import { Pipe, PipeTransform } from '@angular/core';
import { UIEventState } from '../../../types';
import { ALERT_TYPES } from './types';

@Pipe({
  name: 'alertType',
  standalone: true,
  pure: true,
})
export class AlertTypePipe implements PipeTransform {
  //
  transform(value: UIEventState) {
    return ALERT_TYPES[value ?? 'none'] ?? 'default';
  }
}
