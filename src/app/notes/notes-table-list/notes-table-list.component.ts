import { ChangeDetectionStrategy, Component, input, output, viewChild, effect, inject, afterNextRender } from '@angular/core';
import { Note } from '../model/note';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EditNoteDialogComponent } from '../edit-note-dialog/edit-note-dialog.component';
import { defaultDialogConfig } from '../shared/default-dialog-config';
import { NotesFacade } from '../store/notes.facade';
import { MatFormField, MatInput } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';

@Component({
    selector: 'notes-table-list',
    templateUrl: './notes-table-list.component.html',
    styleUrls: ['./notes-table-list.component.scss'],
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
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatSortHeader,
        MatCellDef,
        MatCell,
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
export class NotesTableListComponent {
  notes = input<Note[]>([]);
  noteChanged = output<void>();

  notesFacade = inject(NotesFacade);
  private dialog = inject(MatDialog);

  columnsToDisplay = ['title', 'created', 'important'];
  expandedNote: Note | null = null;
  label: { [key: string]: string } = {
    title: 'Title',
    created: 'Date Created',
    important: '',
  };

  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  dataSource = new MatTableDataSource<Note>([]);

  constructor() {
    // Initialize dataSource when notes change
    effect(() => {
      const notes = this.notes();
      this.dataSource.data = notes;

      // custom filter, search only on Title column
      this.dataSource.filterPredicate = (note: Note, filters: string) => {
        const matchFilter: boolean[] = [];
        const filterArray = filters.split(',');
        const columns = [note.title];
        filterArray.forEach(filter => {
          const customFilter: boolean[] = [];
          columns.forEach(column => customFilter.push(column.toLowerCase().includes(filter)));
          matchFilter.push(customFilter.some(Boolean));
        });
        return matchFilter.every(Boolean);
      };
    });

    // Update paginator and sort when they become available
    afterNextRender(() => {
      effect(() => {
        const paginator = this.paginator();
        const sort = this.sort();
        
        if (paginator) {
          this.dataSource.paginator = paginator;
        }
        if (sort) {
          this.dataSource.sort = sort;
        }
      });
    });
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









