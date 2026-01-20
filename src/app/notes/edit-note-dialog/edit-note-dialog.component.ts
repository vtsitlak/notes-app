import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Note } from '../model/note';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotesStore } from '../notes.store';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'note-dialog',
    templateUrl: './edit-note-dialog.component.html',
    styleUrls: ['./edit-note-dialog.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgIf, MatProgressSpinner, ReactiveFormsModule, MatFormField, MatInput, MatSlideToggle, MatDialogActions, MatButton]
})
export class EditNoteDialogComponent {

    form!: FormGroup;

    dialogTitle!: string;

    note!: Note;

    mode!: 'create' | 'update';

    notesStore = inject(NotesStore);

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditNoteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any) {

        this.dialogTitle = data.dialogTitle;
        this.note = data.note;
        this.mode = data.mode;

        const formControls = {
            title: ['', Validators.required],
            body: ['', Validators.required],
            important: [false, Validators.required],
        };

        if (this.mode === 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({ ...data.note });
        } else if (this.mode === 'create') {
            this.form = this.fb.group({
                ...formControls,
            });
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {

        const note: Note = {
            ...this.note,
            ...this.form.value
        };

        if (this.mode === 'update') {
            this.notesStore.update({ noteId: note.id, changes: this.form.value });
            this.dialogRef.close();
        } else if (this.mode === 'create') {
            note.created = new Date().toISOString();
            note.id = Math.max(...this.notesStore.notes().map(n => n.id), 0) + 1;
            this.notesStore.add(note);
            this.dialogRef.close();
        }
    }
}
