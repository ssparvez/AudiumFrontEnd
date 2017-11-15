import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {MzToastService} from "ng2-materialize/dist";


@Component({
  selector: 'app-confirm-downgrade',
  templateUrl: './confirm-downgrade.component.html',
  styleUrls: ['./confirm-downgrade.component.css']
})
export class ConfirmDowngradeComponent implements OnInit {

  constructor(private dialogRef:MdDialogRef<ConfirmDowngradeComponent>,
              private toastService: MzToastService) { }

  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
