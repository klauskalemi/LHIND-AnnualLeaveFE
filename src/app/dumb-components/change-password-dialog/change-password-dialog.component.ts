import {Component, Inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from "../../domain/services/auth.service";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent {
  password: string;
  passwordConfirmation: string;
  hide: boolean;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
  ) {
    this.hide = true;
  }

  changePassword(): void {
    if (this.isPasswordValid()) {
      this.authService.changePassword(this.password)
        .subscribe(() => this.dialogRef.close(this.password));
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private isPasswordValid(): boolean {
    return this.password
      && this.passwordConfirmation
      && this.password === this.passwordConfirmation;
  }
}
