import { ChangeDetectionStrategy, Component, input, output, viewChild, effect, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { Note } from '../model/note';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { EditNoteDialogComponent } from '../edit-note-dialog/edit-note-dialog.component';
import { defaultDialogConfig } from '../shared/default-dialog-config';
import { NotesFacade } from '../store/notes.facade';

@Component({
  selector: 'notes-table-list',
  templateUrl: './notes-table-list.component.html',
  styleUrls: ['./notes-table-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
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
    effect(() => {
      const notes = this.notes();
      this.dataSource.data = notes;
      // Drop stale object identity after store reload/update
      this.expandedNote = null;

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

    // viewChild signals update when available; keep effect in constructor injection context
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
  }

  formatCreated(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    try {
      return formatDate(value, 'dd/MM/yyyy', 'en-US');
    } catch {
      return '';
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
      mode: 'update',
    };

    this.dialog
      .open(EditNoteDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.noteChanged.emit());
  }

  onDeleteCourse(note: Note) {
    this.notesFacade.delete(note.id);
  }
}
