import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../domain/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() isAuthenticated: boolean;

  @Input() username: string;

  @Output() toggleMenu = new EventEmitter();

  @Output() logout = new EventEmitter();

  @Output() changePassword = new EventEmitter();
}
