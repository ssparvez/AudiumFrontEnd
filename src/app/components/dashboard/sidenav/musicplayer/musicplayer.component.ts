import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService} from '../../../../services/player/player.service';
import { Song } from '../../../../classes/Song';
import { DataService } from '../../../../services/data.service';
import { Router } from '@angular/router';
import { SongQueue } from '../../../../classes/SongQueue';
import { GeneralService } from '../../../../services/general/general.service';
import {PlaybackService} from "../../../../services/playback/playback.service";

@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.component.html',
  styleUrls: ['./musicplayer.component.css']
})
export class MusicplayerComponent implements OnInit {
  // just testing for now

  mediaPath: string;
  songQueue: any[];
  previousQueue: any[];
  queueIndex = 0;
  playIcon = "play_arrow";
  soundIcon = "volume_up";
  repeatIcon = "repeat";
  isPlaying = false;
  // isMuted = false;
  isShuffled = false;
  isRepeated = false;
  previousVolumeLevel = 1;
  repeatLevel = 0;
  seekPosition = 0;

  private currentlyPlaying: Song;
  private isCurrentlyPlaying: boolean;
  private volumeLevel = 0.2;
  private isMuted: boolean;
  private isRepeating: boolean;
  private isShuffling: boolean;

  constructor(
    private playerService: PlayerService,
    private dataService: DataService,
    private generalService: GeneralService,
    private playbackService: PlaybackService,
    private router: Router ) {
    this.playbackService.isPlaying.subscribe(
      isPlaying => {
        this.isCurrentlyPlaying = isPlaying;
      }
    );
    this.playbackService.volumeLevel = this.volumeLevel;

    this.playbackService.currentlyPlaying.subscribe(
      song => {
        console.log(song);
        this.currentlyPlaying = song;
        // this.volumeLevel = this.playbackService.getVolume();
        console.log(this.volumeLevel);
        let songTime = this.playbackService.getCurrentSongTIme().subscribe(
          time => {
            if ( time !== undefined) {
              this.seekPosition = time;
            } else {
              songTime.unsubscribe();
            }
          }
        );
      }
    );
  }

  ngOnInit() {
  }


  togglePlayback():void {
    this.isCurrentlyPlaying ? this.playbackService.pause() : this.playbackService.resumePlay();
  }

  public seek(value) {
    this.playbackService.setSeek(value);
    this.seekPosition = value;
  }

  public setVolume(value) {
    this.playbackService.setVolume(value);
    this.volumeLevel = value;
  }

  public mute() {
    if(this.isMuted) {
      this.playbackService.mute(false);
      this.soundIcon =  "volume_up";
      this.isMuted = false;
    } else {
      this.playbackService.mute(true);
      this.soundIcon = "volume_off";
      this.isMuted = true;
    }
  }

  public shuffle() {
    this.isShuffling = !this.isShuffling;
    this.playbackService.setShuffle(this.isShuffling);
  }

  public nextSong() {
    this.playbackService.nextSong();
  }

  public previousSong() {
    this.playbackService.previousSong();
  }

  public playSong(index) {
    this.playbackService.playSongFromQueue(index);
  }

  public pauseSong() {
    this.playbackService.pause();
  }

  public repeat() {
    this.isRepeating = !this.isRepeating;
    console.log(this.isRepeating);
    this.playbackService.repeat(this.isRepeating);
  }

  viewQueue(): void {
    this.playerService.currentSongQueue = this.songQueue;
    this.router.navigate(['/dash/queue/']);
  }
}
