import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LeaveRequest} from '../../../domain/models/leave-request';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../../domain/models/user';
import {Util} from '../../../domain/utils/util';

@Component({
  selector: 'app-leave-request-dialog',
  templateUrl: './leave-request-dialog.component.html',
  styleUrls: ['./leave-request-dialog.component.css'],
})
export class LeaveRequestDialogComponent {
  leaveRequest: LeaveRequest;

  leaveRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  currentUser: User;

  constructor(
    public dialogRef: MatDialogRef<LeaveRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { leaveRequest, user },
  ) {
    if (this.data && this.data.leaveRequest) {
      this.leaveRequest = this.data.leaveRequest;
    }
    if (this.data && this.data.user) {
      this.currentUser = this.data.user;
    }
  }

  save(): void {
    this.updateValuesBeforeSaving();
    if (this.isLeaveRequestValid()) {
      this.dialogRef.close(this.leaveRequest);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private updateValuesBeforeSaving(): void {
    this.leaveRequest.startDate = this.leaveRange.value.start;
    this.leaveRequest.endDate = this.leaveRange.value.end;
    if (!this.leaveRequest.id) {
      this.leaveRequest.user = this.currentUser;
      this.leaveRequest.status = 0;
    }
  }

  private isLeaveRequestValid(): boolean {
    return this.leaveRequest.reason && this.leaveRequest.reason.trim().length !== 0
      && this.leaveRequest.startDate != null
      && this.leaveRequest.endDate != null;
  }
}
