import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, OnChanges, inject } from '@angular/core';
import { Note } from '../model/note';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EditNoteDialogComponent } from '../edit-note-dialog/edit-note-dialog.component';
import { defaultDialogConfig } from '../shared/default-dialog-config';
import { NotesStore } from '../notes.store';
import { MatFormField, MatInput } from '@angular/material/input';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';

@Component({
    selector: 'notes-table-list',
    templateUrl: './notes-table-list.component.html',
    styleUrls: ['./notes-table-list.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('detailExpand', [
            state('collapsed, void', style({ height: '0px' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
        ]),
    ],
    imports: [
        MatFormField,
        MatInput,
        MatTable,
        MatSort,
        NgFor,
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatSortHeader,
        MatCellDef,
        MatCell,
        NgIf,
        MatIcon,
        MatTooltip,
        MatIconButton,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRowDef,
        MatRow,
        MatPaginator,
        DatePipe,
    ],
})
export class NotesTableListComponent implements OnChanges {

  @Input()
  notes!: Note[];

  @Output()
  noteChanged = new EventEmitter();

  notesStore = inject(NotesStore);

  columnsToDisplay = ['title', 'created', 'important'];
  expandedNote: Note | null = null;
  label: { [key: string]: string } = {
    title: 'Title',
    created: 'Date Created',
    important: '',
  };

  dataSource!: MatTableDataSource<Note>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private dialog: MatDialog) {
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.notes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // custom filter, search only on Title column
    this.dataSource.filterPredicate =
      (note: Note, filters: string) => {
        const matchFilter: boolean[] = [];
        const filterArray = filters.split(',');
        const columns = [note.title];
        filterArray.forEach(filter => {
          const customFilter: boolean[] = [];
          columns.forEach(column => customFilter.push(column.toLowerCase().includes(filter)));
          matchFilter.push(customFilter.some(Boolean));
        });
        return matchFilter.every(Boolean);
      }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCourse(note: Note) {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Edit Note',
      note,
      mode: 'update'
    };

    this.dialog.open(EditNoteDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.noteChanged.emit());

  }

  onDeleteCourse(note: Note) {
    // Note: Delete functionality would need to be added to NotesStore
    // For now, just emit the change event
    this.noteChanged.emit();
  }

}









