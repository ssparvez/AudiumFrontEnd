import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService} from '../../../../services/player/player.service';
import { Howl } from 'howler';
import { Song } from '../../../../classes/Song';


@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.component.html',
  styleUrls: ['./musicplayer.component.css']
})
export class MusicplayerComponent implements OnInit {
  imagePath = "https://s3.us-east-2.amazonaws.com/assets.audium.io/images"  
  songQueue: any[];
  previousQueue: any[];
  queueIndex = 0;
  playIcon = "play_arrow";
  soundIcon = "volume_up";
  repeatIcon = "repeat"
  isPlaying = false;
  isMuted = false;
  isShuffled = false;
  isRepeated = false;
  volumeLevel = 1;
  previousVolumeLevel = 1;
  repeatLevel = 0;
  value = 0;

  constructor(private playerService : PlayerService) { }
  ngOnInit() {
    this.songQueue = [];
    this.playerService.songQueueSubject.subscribe((songs) => {
      console.log(songs)
      if(songs != []) {
        // destroy old queue first
        if(this.songQueue != []) {
          // unload each existing howl object
          for(let song of this.songQueue) {
            song.sound.unload();
          }
          this.songQueue = [];
        }
        this.songQueue = songs.map(x => Object.assign({}, x));
        this.initSongs();
        // get song index
        this.playerService.queueIndexSubject.subscribe((index) => {
          console.log(index);
          this.queueIndex = index;
          this.togglePlay();
        });
      }
    });

    // this.songQueue = [
    //   {songId: 1, title: "The Less I Know the Better", artistName: "Tame Impala", url: '../../../../../assets/songs/TheLessIKnowTheBetter.m4a', albumArtUrl: "../../../../../assets/images/currents.jpg"},
    //   {songId: 2, title: "Intro", artistName: "The xx", url: '../../../../../assets/songs/Intro.mp3', albumArtUrl: '../../../../../assets/images/xx.png'},
    //   {songId: 3, title: "Feels Good Inc.", artistName: "Gorillaz", url: '../../../../../assets/songs/FeelsGoodInc.mp3', albumArtUrl: '../../../../../assets/images/demondays.jpeg'},
    //   {songId: 4, title: "song 4", artistName: "Gorillaz", url: '../../../../../assets/songs/FeelsGoodInc.mp3', albumArtUrl: '../../../../../assets/images/demondays.jpeg'}
    // ];
    // init the songs
    //this.initSongs();
    //console.log(this.songQueue);
  }
  initSongs(): void { // attaches howl object to each song
    for(let song of this.songQueue) {
      song.sound = new Howl({
        src: ['../../../../../assets/songs/TheLessIKnowTheBetter.m4a'],
        onend: () => {
          switch(this.repeatLevel) {
            case 0: {
              this.toggleNext();
               break;
            }
            case 1: { // if last song, restart queue
               if(this.queueIndex == this.songQueue.length - 1) {
                this.songQueue[this.queueIndex].sound.stop();
                this.queueIndex = 0;
                this.togglePlay();
               }
               else {
                 this.toggleNext();
               }
               break;
            }
            case 2: {
               this.songQueue[this.queueIndex].sound.stop();
               this.songQueue[this.queueIndex].sound.play();
               break;
            }
         }
        }
      });
    }
  }

  togglePlayback():void {
    this.isPlaying ? this.togglePause() : this.togglePlay();
  }
  togglePause():void {
    this.playIcon = "play_arrow";
    this.isPlaying = false;
    this.songQueue[this.queueIndex].sound.pause();
  }
  togglePlay(): void {
    this.playIcon = "pause";
    this.isPlaying = true;
    this.songQueue[this.queueIndex].sound.volume(this.volumeLevel);
    this.songQueue[this.queueIndex].sound.play();
  }
  toggleNext(): void {
    if(this.queueIndex != this.songQueue.length - 1) {
      this.songQueue[this.queueIndex].sound.stop();
      this.queueIndex += 1;
      this.togglePlay();
    }
  }
  togglePrevious(): void {
    if(this.queueIndex != 0) {
      this.songQueue[this.queueIndex].sound.stop(); // stop current song
      this.queueIndex -= 1;
      this.togglePlay();
    }
  }

  toggleMute():void {
    if(this.isMuted) {
      this.soundIcon = this.previousVolumeLevel > 0.5 ? "volume_up" : "volume_down";
      this.volumeLevel = this.previousVolumeLevel;
      this.isMuted = false;
    }
    else {
      this.soundIcon = "volume_off";
      this.previousVolumeLevel = this.volumeLevel;
      this.volumeLevel = 0;
      this.isMuted = true;
    }
    this.songQueue[this.queueIndex].sound.volume(this.volumeLevel);
  }

  changeVolume(value: number) {
    this.volumeLevel = value / 100;
    this.songQueue[this.queueIndex].sound.volume(this.volumeLevel)
    if(this.volumeLevel == 0) {
      this.soundIcon = "volume_off";
      this.isMuted = true;
    }
    else {
      if(this.volumeLevel > 0.5) {
        this.soundIcon = "volume_up";
      }
      else {
        this.soundIcon = "volume_down";
      }
      this.isMuted = false;
    }
  }

  toggleShuffle(): void {
    if(this.isShuffled) {
      this.songQueue = this.previousQueue.map(x => Object.assign({}, x)); // copy array
      this.isShuffled = false;
    } else {
      this.previousQueue = this.songQueue.map(x => Object.assign({}, x));
      // fisher-yates shuffle
      for (let i = this.songQueue.length - 1; i > this.queueIndex; i--) {
        let j = Math.floor(Math.random() * (i - this.queueIndex)) + this.queueIndex + 1;
        let x = this.songQueue[i];
        this.songQueue[i] = this.songQueue[j];
        this.songQueue[j] = x;
      }
      this.isShuffled = true;
    }
    console.log(this.songQueue);
  }
  toggleRepeat(): void {
    if(this.repeatLevel == 2) {
      this.repeatLevel = 0;
      this.isRepeated = false;
      this.repeatIcon = "repeat";
    }
    else {
      this.repeatLevel++;
      this.isRepeated = true;
      if(this.repeatLevel == 2) {
        this.repeatIcon = "repeat_one";
      }
    }
    console.log("toggle level:" + this.repeatLevel);
  }

  seekTrack(value: number): void {
    this.songQueue[this.queueIndex].sound.seek(value);
    this.value = value;
    console.log(this.songQueue[this.queueIndex].sound.seek())
  }
}