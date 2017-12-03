import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../../../../../services/general/general.service';
import { Album } from '../../../../../../classes/Album';

@Component({
  selector: 'app-artist-content-songs',
  templateUrl: './artist-content-songs.component.html',
  styleUrls: ['./artist-content-songs.component.css']
})
export class ArtistContentSongsComponent implements OnInit {
  id: number;
  album: Album;
  constructor(private route: ActivatedRoute, private generalService: GeneralService) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.generalService.get("/albums/" + this.id).subscribe((album) => {
        this.album = album;
		    this.generalService.get( "/albums/" + this.id + "/songs").subscribe((songs) => {
          this.album.songs = songs;
        });
      });
    });
  }

}
