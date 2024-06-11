import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Link } from '../link';

/**
 * Provides application links
 */
export const APP_LINKS = new InjectionToken<Observable<Link[]>>(
  'Application links provider token'
);
