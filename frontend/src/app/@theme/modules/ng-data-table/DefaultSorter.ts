import { Component, Input, OnInit } from '@angular/core';
import { DataTable, SortEvent } from './DataTable';

@Component({
  selector: 'mfDefaultSorter',
  styleUrls: ['./default-sorter.component.scss'],
  template: `<a class="tb-sort" (click)="sort()">
    <ng-content></ng-content>
    <i *ngIf="isSortedByMeAsc" class="eva eva-arrow-upward-outline"></i>
    <i *ngIf="isSortedByMeDesc" class="eva eva-arrow-downward-outline"></i>
  </a>`,
})
export class DefaultSorter implements OnInit {
  @Input('by') sortBy: string;
  isSortedByMeAsc: boolean = false;
  isSortedByMeDesc: boolean = false;

  public constructor(private mfTable: DataTable) {}

  ngOnInit(): void {
    this.mfTable.onSortChange.subscribe((event: SortEvent) => {
      this.isSortedByMeAsc =
        event.sortBy == this.sortBy && event.sortOrder == 'asc';
      this.isSortedByMeDesc =
        event.sortBy == this.sortBy && event.sortOrder == 'desc';
    });
  }

  sort() {
    if (this.isSortedByMeAsc) {
      this.mfTable.setSort(this.sortBy, 'desc');
    } else {
      this.mfTable.setSort(this.sortBy, 'asc');
    }
  }
}
