import { Pipe, PipeTransform } from '@angular/core';
import { UIActionState } from '../../../types';
import { ALERT_TYPES } from './types';

@Pipe({
  name: 'alertType',
  standalone: true,
  pure: true,
})
export class AlertTypePipe implements PipeTransform {
  //
  transform(value: UIActionState) {
    return ALERT_TYPES[value ?? 'none'] ?? 'default';
  }
}
