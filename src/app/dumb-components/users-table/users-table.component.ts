/* tslint:disable:no-inferrable-types */
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnDestroy, Output,
  ViewChild
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of, Subject} from 'rxjs';
import {catchError, map, startWith, switchMap, take, takeUntil} from 'rxjs/operators';
import {User} from '../../domain/models/user';
import {Util} from '../../domain/utils/util';

@Component({
  selector: 'app-users-table',
  templateUrl: 'users-table.component.html',
  styleUrls: ['users-table.component.css'],
})
export class UsersTableComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  displayedColumns: string[] = ['id', 'username', 'email', 'createdAt', 'roles', 'actions'];

  dataSource: Observable<User[]>;

  loading = true;

  private destroy$ = new Subject<void>();

  @Input() users: Observable<User[]>;

  @Input() hideActions: boolean = false;

  @Output() edit: EventEmitter<User> = new EventEmitter();

  @Output() delete: EventEmitter<User> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.getDataSource();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    this.users
      .pipe(take(1))
      .subscribe(
        (users: User[]) => {
          const filter = filterValue.trim().toLowerCase();
          const filteredUsers = users.filter(user => Util.includesFilter(user, filter));
          this.getDataSource(of(filteredUsers));
        }
      );
  }

  private getDataSource(users: Observable<User[]> = this.users): void {
    this.dataSource = this.sort.sortChange
      .pipe(
        startWith({}),
        takeUntil(this.destroy$),
        switchMap(() => {
          this.loading = true;
          return users;
        }),
        map(data => {
          this.loading = false;
          return data;
        }),
        catchError(() => {
          this.loading = false;
          return of([]);
        })
      );
  }
}
