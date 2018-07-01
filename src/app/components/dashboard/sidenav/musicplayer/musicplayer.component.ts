import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Song } from '../../../../classes/Song';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { SongQueue } from '../../../../classes/SongQueue';
import { GeneralService } from '../../../../services/general/general.service';
import {PlaybackService} from "../../../../services/playback/playback.service";

@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.component.html',
  styleUrls: ['./musicplayer.component.css']
})
export class MusicPlayerComponent implements OnInit {
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
  private volumeLevel = 0.5;
  private isMuted: boolean;
  private isRepeating  = 0;
  private isShuffling: boolean;

  constructor(
    private generalService: GeneralService,
    private playbackService: PlaybackService,
    private router: Router ) {
    this.playbackService.isPlaying.subscribe(isPlaying => this.isCurrentlyPlaying = isPlaying);
    this.playbackService.volumeLevel = this.volumeLevel;

    this.playbackService.currentlyPlaying.subscribe(
      song => {
        this.currentlyPlaying = song;
        // this.volumeLevel = this.playbackService.getVolume();
        let songTime = this.playbackService.getCurrentSongTIme().subscribe(time => {
            if ( time !== undefined) this.seekPosition = time;
            else songTime.unsubscribe();
          }
        );
      }
    );
  }

  ngOnInit() {
    this.mediaPath = environment.mediaURL;
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
    if ( this.isRepeating === 0) {
      this.repeatIcon = "repeat";
      this.isRepeating++;
    } else if (this.isRepeating === 1) {
      this.repeatIcon = "repeat_one";
      this.isRepeating++;
    } else if (this.isRepeating === 2) {
      this.repeatIcon = "repeat";
      this.isRepeating = 0;
    }
    this.playbackService.repeat(this.isRepeating);
  }
}
