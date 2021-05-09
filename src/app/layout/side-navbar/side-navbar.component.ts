/* tslint:disable:no-inferrable-types */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../domain/services/user.service';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../domain/models/user';
import {AnnualLeaveCache} from '../../domain/utils/annual-leave-cache';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavbarComponent implements OnInit, OnDestroy {
  userIsAdmin: boolean = false;

  userIsSupervisor: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.userService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: User[]) => {
        const currentUser = users.find(user => user.username === AnnualLeaveCache.getItem('currentUsername'));
        this.userIsAdmin = currentUser.roles.filter(role => role.name === 'ROLE_ADMIN').length !== 0;
        this.userIsSupervisor = currentUser.roles.filter(role => role.name === 'ROLE_SUPERVISOR').length !== 0;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
