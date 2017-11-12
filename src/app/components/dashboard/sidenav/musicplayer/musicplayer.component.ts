import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService} from '../../../../services/player/player.service';
import { Howl } from 'howler';


@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.component.html',
  styleUrls: ['./musicplayer.component.css']
})
export class MusicplayerComponent implements OnInit {
  songQueue: Song[];
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

  constructor(private playerService : PlayerService) { }
  ngOnInit() {
   this.songQueue = [
      new Song(1, "The Less I Know the Better", "Tame Impala", 'https://s3.us-east-2.amazonaws.com/media.audium.io/audio/TheLessIKnowTheBetter.m4a', "../../../../../assets/images/currents.jpg"),
      new Song(2, "Intro", "The xx", '../../../../../assets/songs/Intro.mp3', '../../../../../assets/images/xx.png'),
      new Song(3, "Feels Good Inc.", "Gorillaz", '../../../../../assets/songs/FeelsGoodInc.mp3', '../../../../../assets/images/demondays.jpeg'),
      new Song(4, "song 4", "Gorillaz", '../../../../../assets/songs/FeelsGoodInc.mp3', '../../../../../assets/images/demondays.jpeg')
    ];
    // init the songs
    for(let song of this.songQueue) {
      song.sound = new Howl({
        src: [song.url],
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
    console.log(this.songQueue);
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
    // let max = 100;
    // let min = 0;
    // var percent = Math.ceil(((value - min) / (max - min)) * 100);
    // console.log(min);
    // $('span.volume-slider input[type="range"]::-ms-fill-lower').css('background', '-(left, #e74c3c 0%, #e74c3c ' + percent + '%, #999 ' + percent + '%)');
  }

  toggleShuffle(): void {
    if(this.isShuffled) {
      this.isShuffled = false;
    } else {
      // fisher-yates shuffle
      for (let i = this.songQueue.length - 1; i > this.queueIndex; i--) {
        let j = Math.floor(Math.random() * (i - this.queueIndex + 1)) + this.queueIndex + 1;
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
}

class Song {
  id: number;
  title: string;
  artist: string;
  playing = false;
  sound: Howl;
  url: string;
  albumArtUrl: string;

  constructor(id, title, artist,url, albumArtUrl) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.url = url;
    this.albumArtUrl = albumArtUrl;
  }
}
