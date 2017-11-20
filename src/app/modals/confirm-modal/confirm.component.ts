import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";



@Component({
  selector: 'app-confirm-downgrade',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  message: string;

  constructor(private dialogRef:MatDialogRef<ConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) private data:{message: string}) {
    this.message = data.message;
  }

  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
