/* tslint:disable:no-inferrable-types */
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of, Subject} from 'rxjs';
import {catchError, map, startWith, switchMap, take, takeUntil} from 'rxjs/operators';
import {Util} from '../../domain/utils/util';
import {LeaveRequest} from '../../domain/models/leave-request';

@Component({
  selector: 'app-leave-requests-table',
  templateUrl: 'leave-requests-table.component.html',
  styleUrls: ['leave-requests-table.component.css'],
})
export class LeaveRequestsTableComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  displayedColumns: string[] = ['id', 'startDate', 'endDate', 'reason', 'status', 'user', 'actions'];

  dataSource: Observable<LeaveRequest[]>;

  loading = true;

  private destroy$ = new Subject<void>();

  @Input() leaveRequests: Observable<LeaveRequest[]>;

  @Input() isSupervisorMode: boolean = false;

  @Output() edit: EventEmitter<LeaveRequest> = new EventEmitter();

  @Output() delete: EventEmitter<LeaveRequest> = new EventEmitter();

  @Output() approve: EventEmitter<LeaveRequest> = new EventEmitter();

  @Output() reject: EventEmitter<LeaveRequest> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

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

    this.leaveRequests
      .pipe(take(1))
      .subscribe(
        (leaveRequests: LeaveRequest[]) => {
          const filter = filterValue.trim().toLowerCase();
          const filteredRequests = leaveRequests.filter(leaveRequest => Util.includesFilter(leaveRequest, filter));
          this.getDataSource(of(filteredRequests));
        }
      );
  }

  private getDataSource(leaveRequests: Observable<LeaveRequest[]> = this.leaveRequests): void {
    this.dataSource = this.sort.sortChange
      .pipe(
        startWith({}),
        takeUntil(this.destroy$),
        switchMap(() => {
          this.loading = true;
          return leaveRequests;
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
