import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../../../services/general/general.service";
import {Router} from "@angular/router";
import {AppError} from "../../../../errors/AppError";
import {Song} from "../../../../classes/Song";
import {MzToastService} from "ng2-materialize";

@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.css']
})
export class SongSearchComponent implements OnInit {

  songs: Song[];
  public contentType: string;

  constructor(private dialogRef:MatDialogRef<SongSearchComponent>,
              private service: GeneralService,
              private dialog: MatDialog,
              private router: Router,
              private generalService: GeneralService,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data:{ adminId: number, contentId: number, contentType: string}) { }

  ngOnInit() {
    this.contentType = this.data.contentType;
  }

  onEnter(keywords: string) {

    // this.router.navigate([{outlets: {songResults: ['searchsong']}}],{ queryParams: {keywords: keywords}} );
    this.generalService.get("/search/songs/" + keywords).subscribe(
      (songs) => {
      this.songs = songs;
    }, (error: AppError) => {
    });
  }

  addSongToContent(songToAdd) {
    this.service.post('/admin/' + this.data.adminId + '/'+ this.contentType.toLowerCase() + '/' +
      this.data.contentId +'/add/song/' + songToAdd, null).subscribe(
      response => {
        this.toastService.show("Added", 1000, 'blue');
      }, (error: AppError) => {
        this.toastService.show("Song was not added", 2000, 'blue');
      }
    );
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
