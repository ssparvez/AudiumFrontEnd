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
  isPlaying = false;
  isMuted = false;
  isShuffled = false;
  isRepeated = false;

  constructor(private playerService : PlayerService) { }
  ngOnInit() {
   this.songQueue = [
      new Song(1, "The Less I Know the Better", "Tame Impala", '../../../../../assets/songs/TheLessIKnowTheBetter.m4a', "../../../../../assets/images/currents.jpg"),
      new Song(2, "Feels Good Inc.", "Gorillaz", '../../../../../assets/songs/FeelsGoodInc.mp3', '../../../../../assets/images/demondays.jpeg'),
      new Song(2, "song 3", "Gorillaz", '../../../../../assets/songs/FeelsGoodInc.mp3', '../../../../../assets/images/demondays.jpeg'),
      new Song(2, "song 4", "Gorillaz", '../../../../../assets/songs/FeelsGoodInc.mp3', '../../../../../assets/images/demondays.jpeg')
    ]
    // init the songs
    for(let song of this.songQueue) {
      song.sound = new Howl({
        src: [song.url],
        onend: () => { this.toggleNext(); }
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
    if(this.isMuted) {
      this.songQueue[this.queueIndex].sound.mute(true);
    }
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
      this.soundIcon = "volume_up"; 
      this.songQueue[this.queueIndex].sound.mute(false);
    } else {
      this.soundIcon = "volume_off"; 
      this.songQueue[this.queueIndex].sound.mute(true);
    }
    this.isMuted = !this.isMuted
  }

  toggleShuffle(): void {
    if(this.isShuffled) {

    } else {
      for (let i = this.songQueue.length - 1; i > this.queueIndex + 1; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = this.songQueue[i];
        this.songQueue[i] = this.songQueue[j];
        this.songQueue[j] = x;
      }
    }
  }
  // REPeaT NOT WORKING RN
  toggleRepeat(): void {
    if(this.isRepeated){
       this.songQueue[this.queueIndex].sound.loop(true);
       this.songQueue[this.queueIndex].sound.on('end', () => {});
     } else {
       this.songQueue[this.queueIndex].sound.loop(false);
     }
    this.isRepeated = !this.isRepeated;
  }
}

class Song {
  id: number;
  title: string;
  artist : string;
  playing = false;
  sound : Howl;
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
