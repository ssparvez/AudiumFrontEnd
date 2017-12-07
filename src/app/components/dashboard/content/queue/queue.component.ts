import {Component, OnDestroy, OnInit} from '@angular/core';
import { Song } from '../../../../classes/Song';
import {PlaybackService} from "../../../../services/playback/playback.service";
import "rxjs/add/operator/takeUntil";
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit, OnDestroy {
  nowPlaying: Song[];
  previousSong: Song[];
  nextUp: Song[];
  nextInQueue: Song[];
  private positionInQueue: number;
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private playbackService: PlaybackService) {

    this.playbackService.songAddedToUserQueue.takeUntil(this.unsubscribe).subscribe(
      song => {
        this.nextInQueue.push(song);
      });
    this.playbackService.songRemovedFromUserQueue.takeUntil(this.unsubscribe).subscribe(
      song => {
        this.nextInQueue.unshift();
      });

    this.playbackService.currentlyPlaying.takeUntil(this.unsubscribe).subscribe(
      song => {
        this.nowPlaying = [];
        this.nowPlaying.push(song);
        this.nowPlaying[0].isPlaying = song.isPlaying;
        this.nowPlaying[0].isPaused = song.isPaused;

        if ( this.nextInQueue.length <= 0) {
          this.nextUp = this.playbackService.getQueue().slice(this.playbackService.getPositionInQueue()+1);
        }
      });
    this.nowPlaying = [];
    this.previousSong = [];
    this.nextInQueue = [];

    if ( this.playbackService.getSongCurrentlyPlaying() != null) {
      this.nowPlaying.push(this.playbackService.getSongCurrentlyPlaying());
    }
    this.nextUp = this.playbackService.getQueue().slice(this.playbackService.getPositionInQueue()+1);
    this.nextInQueue = this.playbackService.getUserQueue();

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
