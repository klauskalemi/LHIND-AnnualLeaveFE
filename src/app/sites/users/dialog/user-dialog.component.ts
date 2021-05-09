import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../domain/models/user';
import {Role} from '../../../domain/models/role';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent {
  user: User;
  roles: Role[];
  selectedRoles: boolean[];
  hide: boolean;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user, roles },
  ) {
    this.hide = true;
    if (this.data && this.data.user) {
      this.user = this.data.user;
    }
    if (this.data && this.data.roles?.length) {
      this.roles = this.data.roles;
      this.selectedRoles = new Array<boolean>(this.roles.length);
      if (this.user.roles) {
        this.user.roles.forEach((role: Role) => {
          this.selectedRoles[role.id - 1] = true;
        });
      }
    }
  }

  save(): void {
    this.updateValuesBeforeSaving();
    if (this.isUserValid()) {
      this.dialogRef.close(this.user);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private updateValuesBeforeSaving(): void {
    this.user.createdAt = new Date();
    this.user.leaveRequests = [];
    this.user.roles = [];

    for (let i = 0; i < this.roles.length; i++) {
      if (this.selectedRoles[i]) {
        this.user.roles.push(this.roles[i]);
      }
    }
  }

  private isUserValid(): boolean {
    return this.user.username && this.user.username.trim().length !== 0
      && (this.user.id || (this.user.password && this.user.password.trim().length !== 0))
      && this.user.email && this.user.email.trim().length !== 0
      && this.user.roles && this.user.roles.length !== 0;
  }
}
