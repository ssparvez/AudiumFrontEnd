import { Injectable } from '@angular/core';
import { Song } from "../../classes/Song";
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Howl } from 'howler';


@Injectable()
export class PlaybackService {

  private playback: Howl;

  public isPlaying = new Subject<boolean>();
  public currentlyPlaying = new Subject<Song>();
  public songAddedToUserQueue = new Subject<Song>();
  public songRemovedFromUserQueue = new Subject<Song>();
  public position = new Subject<number>();
  public previousPlaying = new Subject<Song>();
  public hasBeenLoaded = new Subject<boolean>();



  public volumeLevel: number;
  private queueOfSongs: Song[];
  private userQueue: Song[] = [];
  private isCurrentlyPlaying: boolean;
  public currentSoundPlaying: number;
  private previousSongPlaying: number;
  private currentSongPlaying: Song;

  // Playback Conditionals
  private isLooping = 0;
  private toShuffle: boolean;
  private replayQueue: boolean;
  private previousIndex: number;
  private isUserQueuePlaying: boolean;


  constructor() { }

  public loadSongQueue(songs: Song[]) {
    console.log(songs);
      this.queueOfSongs = Object.assign([], songs);
      this.hasBeenLoaded.next(true);
  }

  public playSong(song: Song) {
    let error: boolean;
    this.queueOfSongs = [];
    this.queueOfSongs.unshift(song);
    this.stopCurrentSound();
    this.playback = new Howl({
      src: [environment.mediaURL + "/audio/" + song.file],
      html5: true,
      volume: this.volumeLevel,
      onplay: (soundId: number) => this.handleOnPlay(soundId, 0),
      onpause: (soundId: number) => this.handleOnPause(0),
      onstop: (soundId: number) => this.handleOnPause(0),
      onplayerror : (soundId: number) => error = true,
      onend:  (soundId: number) => this.handleEnd()
    });

    this.checkForPrevious();
    this.playback.play();
    return (!error);
  }

  public playSongFromQueue(index: number) {
    let error: boolean;
    this.stopCurrentSound();
    this.playback = new Howl({
      src: [environment.mediaURL + "/audio/" + this.queueOfSongs[index].file ],
      html5: true,
      volume: this.volumeLevel,
      onplay: (soundId: number) => this.handleOnPlay(soundId, index),
      onpause: (soundId: number) => this.handleOnPause(index),
      onstop: (soundId: number) => this.handleOnPause(index),
      onplayerror : (soundId: number) => error = true,
      onend:  (soundId: number) => this.handleEnd()
    });
    this.checkForPrevious();
    this.isUserQueuePlaying = false;
    this.playback.play();
    return (!error);
  }

  public playSongFromUserQueue() {
    this.stopCurrentSound();
    let  currentSong = Object.assign({}, this.userQueue[0]);
    this.playback = new Howl({
      src: [environment.mediaURL + "/audio/" + this.userQueue[0].file ],
      html5: true,
      volume: this.volumeLevel,
      onplay: (soundId: number) => {this.isUserQueuePlaying = true; this.handleOnPlay(soundId,0, currentSong);},
      onpause: (soundId: number) => this.handleOnPause(0,currentSong),
      onstop: (soundId: number) => this.handleOnStop(currentSong),
      onend:  (soundId: number) => { this.handleEnd();}
    });
    this.playback.play();
    this.removeSongFromUserQueue();
  }

  public removeSongFromQueue(song: Song) {
    if(this.queueOfSongs != undefined) {
      this.queueOfSongs.splice(this.queueOfSongs.indexOf(song), 1);
    }
  }

  private checkForPrevious() {
    const check  = this.queueOfSongs.indexOf(this.currentSongPlaying);
    if ( check !== -1) {
      if ( this.previousSongPlaying !== check) {
        this.previousSongPlaying = check;
        this.previousPlaying.next(this.queueOfSongs[this.previousSongPlaying]);
        this.previousIndex = check;
      }
    } else {
      this.previousSongPlaying = undefined;
      this.previousPlaying.next(undefined);
    }
  }

  public nextSong() {
    this.stopCurrentSound();
    if (this.userQueue.length > 0) {
     this.playSongFromUserQueue();
    } else {
      const index = this.queueOfSongs.indexOf(this.currentSongPlaying);
      if (this.toShuffle) {
        this.shuffle();
      } else {
        if ( index  !== this.queueOfSongs.length-1) {
          this.playSongFromQueue(index+1);
        } else if ( this.replayQueue) {
          this.playSongFromQueue(0);
        }
      }
    }
  }

  public previousSong() {
    this.stopCurrentSound();
    let index;
    console.log(this.userQueue);
    if (this.isUserQueuePlaying ) {
      index = this.previousIndex+2;
      console.log(index);
    } else {
       index = this.queueOfSongs.indexOf(this.currentSongPlaying);
    }
    if (index !== 0) {
      this.playSongFromQueue(index-1);
    } else  if ( this.replayQueue) {
      this.playSongFromQueue(this.queueOfSongs.length-1);
    }
  }


  public resumePlay() {
  this.playback.play(this.currentSoundPlaying);
  }

  public pause() {
    this.playback.pause(this.currentSoundPlaying);
  }

  public setSeek(value) {
    this.playback.seek(value, this.currentSoundPlaying);
  }

  public getSeek() {
    return +this.playback.seek(this.currentSoundPlaying);
  }

  public setVolume(volumeLevel) {
    this.volumeLevel = volumeLevel;
    this.playback.volume(volumeLevel, this.currentSoundPlaying);
  }

  public getVolume(): number {
    return +this.playback.volume(this.currentSoundPlaying);
  }

  public mute(condition) {
    this.playback.mute(condition,this.currentSoundPlaying);
  }

  public setShuffle(status) {
    this.toShuffle = status;
  }

  public shuffle() {
    let randomNumber = this.randomIntFromInterval(0,this.queueOfSongs.length-1);
    while ( randomNumber === this.queueOfSongs.indexOf(this.currentSongPlaying)) {
      randomNumber = this.randomIntFromInterval(0,this.queueOfSongs.length-1);
    }
    this.playSongFromQueue(randomNumber);
  }

  public repeat(status) {
    this.isLooping = status;
    if ( status === 2) {
      this.replayQueue = false;
      this.playback.loop(true,this.currentSoundPlaying);
    } else if ( status === 1) {
      this.replayQueue = true;
      this.playback.loop(false,this.currentSoundPlaying);
    } else if ( status === 0) {
      this.replayQueue = false;
      this.playback.loop(false,this.currentSoundPlaying);
    }
  }

  public handleOnPlay(soundId:number, index:number, songPlaying?: Song) {
    let song: Song;
    if ( songPlaying !== undefined) {
      song = songPlaying;
    } else {
      song = this.queueOfSongs[index];
    }
    if(song != undefined) {
      song.isPlaying = true;
      song.isPaused = false;
      if ( songPlaying === undefined) {
        this.currentSongPlaying = song;
      }

    } else {
      if(this.currentSongPlaying != undefined) {
        song = this.currentSongPlaying;
      }
    }
    this.isPlaying.next(true);
    this.currentlyPlaying.next(song);
    this.isCurrentlyPlaying = true;
    this.currentSoundPlaying = soundId;

    if ( this.isLooping === 2) {
      this.replayQueue = false;
      this.playback.loop(true,this.currentSoundPlaying);
    }
  }

  public getDuration() {
    return this.playback.duration(this.currentSoundPlaying);
  }

  private handleOnPause(index,songPlaying?: Song) {
    let song: Song;
    if ( songPlaying !== undefined ) {
      song = songPlaying;
    } else {
      song = this.queueOfSongs[index];
    }
    if(song != undefined) {
      song.isPlaying = false;
      song.isPaused = true;
    } else {
      if(this.currentSongPlaying != undefined) {
        song = this.currentSongPlaying;
      }
    }
    this.isCurrentlyPlaying = false;
    this.currentlyPlaying.next(song);
    this.isPlaying.next(false);
  }

  private handleOnStop(songPlaying: Song) {
    let song: Song;
    if ( songPlaying !== undefined ) {
      song = songPlaying;
    }

    if(song != undefined) {
      song.isPlaying = false;
      song.isPaused = false;
    } else {
      if(this.currentSongPlaying != undefined) {
        song = this.currentSongPlaying;
      }
    }
    this.isCurrentlyPlaying = false;
    this.currentlyPlaying.next(song);
    this.isPlaying.next(false);
  }

  private handleEnd() {
    if ( this.isLooping === 2) {
      this.replayQueue = false;
    } else if (this.toShuffle) {
      this.shuffle();
    } else if ( this.isLooping === 0) {
      this.replayQueue = false;
      this.nextSong();
    } else if ( this.isLooping === 1) {
      this.replayQueue = true;
      this.nextSong();
    }
  }

  public getSongCurrentlyPlaying() {
    if ( this.currentSongPlaying === undefined) {
      return null;
    } else {
      return this.currentSongPlaying;
    }
  }

  public getPreviousSongPlaying() {
    return this.queueOfSongs[this.previousSongPlaying];
  }

  public getPositionInQueue() {
    if (this.queueOfSongs === undefined) {
      return 0;
    } else {
      return this.queueOfSongs.indexOf(this.currentSongPlaying);
    }

  }

  public getQueue() {
    if (this.queueOfSongs === undefined) {
      return [];
    } else {
      return this.queueOfSongs;
    }
  }

  public getPlayback() {
    return this.playback;
  }

  public getCurrentSongTIme() {
    return Observable
      .interval(1000)
      .map( value => {
        if (this.playback.playing()) {
          return this.getSeek();
        }
      });
  }

  public randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
  }

  public clean() {
    this.previousPlaying.next(undefined);
    this.previousSongPlaying = undefined;
  }
  private stopCurrentSound() {
    if ( this.currentSoundPlaying !== undefined) {
      this.playback.stop(this.currentSoundPlaying);
    }
  }

  public getUserQueue() {
    if (this.userQueue === undefined) return []; 
    else return this.userQueue;
  }

  public addToUserQueue(song: Song) {
    this.userQueue.push(song);
    this.songAddedToUserQueue.next(song);
  }
   public addListToUserQueue(songs: Song[]) {
    this.userQueue = Object.assign([], songs);
   }

  public removeSongFromUserQueue() {
    this.songRemovedFromUserQueue.next(this.userQueue[0]);
    this.userQueue.shift();
  }

}
