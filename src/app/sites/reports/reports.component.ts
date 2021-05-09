/* tslint:disable:no-inferrable-types */
import {Component, OnInit} from '@angular/core';
import {UserService} from '../../domain/services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {Report} from './models/report';
import {take} from 'rxjs/operators';
import {User} from '../../domain/models/user';
import {Util} from '../../domain/utils/util';
import {LeaveRequestService} from '../../domain/services/leave-request.service';
import {LeaveRequest} from '../../domain/models/leave-request';
import {AnnualLeaveCache} from '../../domain/utils/annual-leave-cache';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  reports: Report[];

  constructor(
    private userService: UserService,
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.reports = [
      {
        name: 'All users',
        description: 'Get a list of all users',
        reportFunction: this.downloadAllUsers,
      },
      {
        name: 'All leave requests',
        description: 'Get a list of all leave requests',
        reportFunction: this.downloadAllLeaveRequests,
      },
      {
        name: 'Leave days per user',
        description: 'Get a list of days each user spent on a leave',
        reportFunction: this.downloadLeaveDaysPerUser,
      },
    ];
  }

  ngOnInit(): void {
    this.userService.findAll()
      .subscribe((users: User[]) => {
        const currentUser = users.find(user => user.username === AnnualLeaveCache.getItem('currentUsername'));
        if (currentUser.roles.filter(role => role.name === 'ROLE_SUPERVISOR').length === 0) {
          this.router.navigate(['home']);
        }
      });
  }

  private downloadAllUsers: () => void = () => {
    const rows = [
      ['ID', 'Username', 'Email', 'Start Date', 'Roles']
    ];
    this.userService.findAll()
      .pipe(take(1))
      .subscribe((data: User[]) => {
        for (const user of data) {
          rows.push(
            [user.id + '', user.username, user.email, user.createdAt + '', Util.getCSVStringFromArray(user.roles)]
          );
        }
        Util.exportRowsToCSV(rows, 'all-users-report');
      }, () => console.log('error'));
  }

  private downloadAllLeaveRequests: () => void = () => {
    const rows = [
      ['ID', 'Reason', 'Status', 'Start Date', 'End Date']
    ];
    this.leaveRequestService.findAll()
      .pipe(take(1))
      .subscribe((data: LeaveRequest[]) => {
        for (const leave of data) {
          rows.push(
            [leave.id + '', leave.reason.replace(',', ''),
              leave.status + '', leave.startDate + '', leave.endDate + '']
          );
        }
        Util.exportRowsToCSV(rows, 'all-leaves-report');
      }, () => console.log('error'));
  }

  private downloadLeaveDaysPerUser: () => void = () => {
    const rows = [
      ['ID', 'Username', 'Email', 'Start Date', 'Leave Days']
    ];
    this.userService.findAll()
      .pipe(take(1))
      .subscribe((data: User[]) => {
        for (const user of data) {
          rows.push(
            [user.id + '', user.username, user.email + '', user.createdAt + '', this.getTotalDaysOfLeave(user) + '']
          );
        }
        Util.exportRowsToCSV(rows, 'leave-days-per-user-report');
      }, () => console.log('error'));
  }


  private getTotalDaysOfLeave(user: User): number {
    let total: number = 0;

    const pastOrCurrentLeaveRequests = user.leaveRequests.filter(leave => {
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

    return total;
  }
}
