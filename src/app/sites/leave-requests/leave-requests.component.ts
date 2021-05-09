import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {LeaveRequest} from '../../domain/models/leave-request';
import {LeaveRequestService} from '../../domain/services/leave-request.service';
import {UserService} from '../../domain/services/user.service';
import {User} from '../../domain/models/user';
import {AnnualLeaveCache} from '../../domain/utils/annual-leave-cache';
import {Router} from '@angular/router';

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css'],
})
export class LeaveRequestsComponent implements OnInit, OnDestroy {
  leaveRequests: Observable<LeaveRequest[]>;

  user: User;

  private destroy$ = new Subject<void>();

  constructor(
    private leaveRequestService: LeaveRequestService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.leaveRequests = this.leaveRequestService.findAll().pipe(takeUntil(this.destroy$));
    this.userService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: User[]) => {
        this.user = users.find(user => user.username === AnnualLeaveCache.getItem('currentUsername'));
        if (this.user.roles.filter(role => role.name === 'ROLE_SUPERVISOR').length === 0) {
          this.router.navigate(['home']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  approveLeaveRequest(leaveRequest: LeaveRequest = new LeaveRequest()): void {
    leaveRequest.status = 1;
    this.leaveRequestService.update(leaveRequest)
      .subscribe(
        res => console.log('res', res),
        error => console.log('error', error),
      );
  }

  rejectLeaveRequest(leaveRequest: LeaveRequest): void {
    leaveRequest.status = 2;
    this.leaveRequestService.update(leaveRequest)
      .subscribe(
        res => console.log('res', res),
        error => console.log('error', error),
      );
  }
}
