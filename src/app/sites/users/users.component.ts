import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../domain/services/user.service';
import {User} from '../../domain/models/user';
import {Observable, Subject} from 'rxjs';
import {take, takeUntil, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {UserDialogComponent} from './dialog/user-dialog.component';
import {Role} from '../../domain/models/role';
import {RoleService} from '../../domain/services/role.service';
import {AnnualLeaveCache} from '../../domain/utils/annual-leave-cache';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: Observable<User[]>;

  private roles: Role[];

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.users = this.userService.findAll()
      .pipe(
        takeUntil(this.destroy$),
        tap((users: User[]) => {
          const currentUser = users.find(user => user.username === AnnualLeaveCache.getItem('currentUsername'));
          if (currentUser.roles.filter(role => role.name === 'ROLE_ADMIN').length === 0) {
            this.router.navigate(['home']);
          }
        })
      );

    this.roleService.findAll()
      .pipe(take(1))
      .subscribe((roles: Role[]) => {
        this.roles = roles;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openUserDialog(user: User = new User()): void {
    this.dialog
      .open(UserDialogComponent, {
        width: '500px',
        data: {
          user: {...user},
          roles: this.roles,
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userResponse: User) => {
        if (userResponse) {
          if (userResponse.id) {
            this.userService.update(userResponse)
              .subscribe(() => {
                if (user.username === AnnualLeaveCache.getItem('currentUsername')) {
                  AnnualLeaveCache.setItem('currentUsername', userResponse.username);
                }
                location.reload();
              }, error => console.log(error));
          } else {
            this.userService.save(userResponse)
              .subscribe(() => {
                location.reload();
              }, error => console.log(error));
          }
        }
      });
  }

  deleteUser(user: User): void {
    if (AnnualLeaveCache.getItem('currentUsername')
      && user.username !== AnnualLeaveCache.getItem('currentUsername')) {
      this.userService.delete(user.id)
        .subscribe(
          () => location.reload(),
          (error) => console.log(error),
        );
    }
  }
}
