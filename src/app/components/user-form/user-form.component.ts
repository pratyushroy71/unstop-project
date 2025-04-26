import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UserFormComponent>) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
