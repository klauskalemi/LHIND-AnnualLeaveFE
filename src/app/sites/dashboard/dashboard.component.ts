/* tslint:disable:no-inferrable-types */
import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../domain/services/user.service';
import {LeaveRequestService} from '../../domain/services/leave-request.service';
import {Observable, of, Subject} from 'rxjs';
import {AnnualLeaveCache} from '../../domain/utils/annual-leave-cache';
import {Router} from '@angular/router';
import {map, takeUntil, tap} from 'rxjs/operators';
import {LeaveRequest} from '../../domain/models/leave-request';
import {Util} from '../../domain/utils/util';
import {User} from '../../domain/models/user';
import {LeaveRequestDialogComponent} from '../leave-requests/dialog/leave-request-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewChecked, OnDestroy {
  totalDaysOfLeave: number = 0;

  daysOfProbationLeft: number = 0;

  daysOfLeaveLeft: number = 0;

  currentUser$: Observable<User>;

  private currentUser: User;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private leaveRequestService: LeaveRequestService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    if (!AnnualLeaveCache.getItem('token') || !AnnualLeaveCache.getItem('currentUsername')) {
      this.router.navigate(['auth']);
    }

    this.currentUser$ = this.userService
      .findAll()
      .pipe(
        takeUntil(this.destroy$),
        tap((data: User[]) => {
          this.currentUser = data.find(user => user.username = AnnualLeaveCache.getItem('currentUsername'));
          this.updateDaysOfProbationLeft(this.currentUser);
          this.updateDaysOfLeaveLeft(this.currentUser);
          this.updateTotalDaysOfLeave(this.currentUser.leaveRequests);
        }),
        map((data: User[]) => {
          return data.find(user => user.username = AnnualLeaveCache.getItem('currentUsername'));
        }),
      );
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getObservable(array: LeaveRequest[]): Observable<LeaveRequest[]> {
    try {
      return of(array);
    } catch (ignored) {
    }
  }

  openLeaveRequestDialog(leaveRequest: LeaveRequest = new LeaveRequest()): void {
    this.dialog
      .open(LeaveRequestDialogComponent, {
        width: '500px',
        data: {
          leaveRequest: {...leaveRequest},
          user: {...this.currentUser},
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((leaveRequestResponse: LeaveRequest) => {
        if (leaveRequestResponse) {
          if (leaveRequestResponse.id) {
            this.leaveRequestService.update(leaveRequestResponse)
              .subscribe(() => {
                location.reload();
              }, error => console.log(error));
          } else {
            this.leaveRequestService.save(leaveRequestResponse)
              .subscribe(() => {
                location.reload();
              }, error => console.log(error));
          }
        }
      });
  }

  deleteLeaveRequest(leaveRequest: LeaveRequest): void {
    this.leaveRequestService.delete(leaveRequest.id)
      .subscribe(
        () => location.reload(),
        error => console.log(error),
        );
  }

  private updateDaysOfProbationLeft(user: User): void {
    const probationLeft: number = 90 - Util.getDaysBetweenTwoDates(new Date(user.createdAt), new Date());
    this.daysOfProbationLeft = probationLeft < 0 ? 0 : probationLeft;
  }

  private updateDaysOfLeaveLeft(user: User): void {
    const currentLeave = user.leaveRequests.find((leave: LeaveRequest) => {
      return Util.getDaysBetweenTwoDates(new Date(leave.startDate), new Date()) > 0
        && Util.getDaysBetweenTwoDates(new Date(leave.endDate), new Date()) < 0
        && leave.status === 1;
    });
    if (!currentLeave) {
      return;
    }
    this.daysOfLeaveLeft = Util.getDaysBetweenTwoDates(new Date(), new Date(currentLeave.endDate));
  }

  private updateTotalDaysOfLeave(leaveRequests: LeaveRequest[]): void {
    let total: number = 0;
    const pastOrCurrentLeaveRequests = leaveRequests.filter(leave => {
      return leave.status === 1
        && (Util.getDaysBetweenTwoDates(new Date(leave.endDate), new Date()) > 0
          || (Util.getDaysBetweenTwoDates(new Date(leave.startDate), new Date()) > 0
            && Util.getDaysBetweenTwoDates(new Date(leave.endDate), new Date()) < 0));
    });
    for (const leaveRequest of pastOrCurrentLeaveRequests) {
      if (Util.getDaysBetweenTwoDates(new Date(leaveRequest.endDate), new Date()) > 0) {
        total += Util.getDaysBetweenTwoDates(new Date(leaveRequest.startDate), new Date(leaveRequest.endDate));
      } else {
        total += Util.getDaysBetweenTwoDates(new Date(leaveRequest.startDate), new Date());
      }
    }
    this.totalDaysOfLeave = total;
  }
}
