import { Component, OnInit } from '@angular/core';
import { Song } from '../../../../classes/Song';
import { PlayerService } from '../../../../services/player/player.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  songs: Song[];
  queueIndex: number;
  isPlaying: boolean;
  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.songs = this.playerService.currentSongQueue;
    this.queueIndex = this.playerService.currentQueueIndex;
    console.log(this.songs);
    this.playerService.queueIndexSubject.subscribe((index) => {
      console.log(index);
      this.queueIndex = index;
    });    
  }

}
