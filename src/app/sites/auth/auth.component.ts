import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../domain/services/auth.service';
import {AnnualLeaveCache} from '../../domain/utils/annual-leave-cache';

@Component({
  selector: 'app-not-found',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  username: string;
  password: string;
  hide: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.hide = true;
  }

  ngOnInit(): void {
    if (AnnualLeaveCache.getItem('token') || AnnualLeaveCache.getItem('currentUsername')) {
      this.router.navigate(['home']);
    }
  }

  login(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password)
        .subscribe((res: any) => {
          AnnualLeaveCache.setItem('token', res.Authorization);
          AnnualLeaveCache.setItem('currentUsername', this.username);
          this.router.navigate(['home']);
        });
    }
  }
}
