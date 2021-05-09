import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ChangePasswordDialogComponent} from '../../dumb-components/change-password-dialog/change-password-dialog.component';
import {Router} from '@angular/router';
import {AnnualLeaveCache} from '../../domain/utils/annual-leave-cache';
import {AuthService} from '../../domain/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentUsername: string;

  isUserAuthenticated: boolean;

  mobileQuery: MediaQueryList;

  private readonly mobileQueryListener: () => void;

  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    public dialog: MatDialog,
    public router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1023px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    if (AnnualLeaveCache.getItem('token') && AnnualLeaveCache.getItem('currentUsername')) {
      this.currentUsername = AnnualLeaveCache.getItem('currentUsername');
      this.isUserAuthenticated = true;
    } else {
      this.onLogout();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChangePassword(): void {
    this.dialog
      .open(ChangePasswordDialogComponent, {width: '400px'})
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          console.log(result);
        }
      });
  }

  onLogout(): void {
    this.authService
      .logout()
      .subscribe(() => {
        this.clearCacheAndNavigateToAuth();
      });
  }

  private clearCacheAndNavigateToAuth(): void {
    AnnualLeaveCache.clearCache();
    this.currentUsername = '';
    this.isUserAuthenticated = false;
    this.router.navigate(['auth']);
  }
}
