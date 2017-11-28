import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {SongSearchComponent} from "../song-search/song-search.component";
import {GeneralService} from "../../../../services/general/general.service";
import {AppError} from "../../../../errors/AppError";
import {MzToastService} from "ng2-materialize";
import {Observable} from "rxjs";

@Component({
  selector: 'app-content-input',
  templateUrl: './content-input.component.html',
  styleUrls: ['./content-input.component.css']
})
export class ContentInputComponent implements OnInit {

  public contentToEdit: string;
  public contentTypeToChange: string;
  public title: string;

  constructor(private dialogRef:MatDialogRef<ContentInputComponent>,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data:{adminId: number, contentType?:string }) {}

  ngOnInit() {
    this.contentTypeToChange = this.data.contentType;
    if ( this.data.contentType === 'Playlist' ) {
      this.title = "Add a Playlist";
    }
    if ( this.data.contentType === 'Album' ) {
      this.title = "Add an Album";
    }
  }

  modifyContent() {
    this.service.get('/' + this.data.contentType.toLowerCase() + '/' + this.contentToEdit + '/exists').subscribe(
      response => {
        if (response) {
          this.closeDialog(this.contentToEdit);
        }
        else this.toastService.show("Not a valid " + this.data.contentType , 2000, 'red');
      },(error: AppError) => {
      }
    );
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
