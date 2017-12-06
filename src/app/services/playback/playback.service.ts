import { Injectable } from '@angular/core';
import {Song} from "../../classes/Song";
import {DataService} from "../data.service";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Howl } from 'howler';


@Injectable()
export class PlaybackService {

  private playback: Howl;

  public isPlaying = new Subject<boolean>();
  public currentlyPlaying = new Subject<Song>();
  public position = new Subject<number>();
  public previousPlaying = new Subject<Song>();



  public volumeLevel: number;
  private queueOfSongs: Song[];
  private isCurrentlyPlaying: boolean;
  public currentSoundPlaying: number;
  private previousSongPlaying: number;
  private currentSongPlaying: Song;

  // Playback Conditionals
  private isLooping: boolean;
  private toShuffle: boolean;

  constructor(private dataService: DataService) {

  }

  public loadSongQueue(songs: Song[]) {
      this.queueOfSongs = songs;
  }

  public playSong(song: Song) {
    let error: boolean;
    this.queueOfSongs = [];
    this.queueOfSongs.unshift(song);
    this.stopCurrentSound();
    this.playback = new Howl({
      src: [this.dataService.songUrl + song.file ],
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
    console.log("Now its playing");
    let error: boolean;
    this.stopCurrentSound();
    this.playback = new Howl({
      src: [this.dataService.songUrl + this.queueOfSongs[index].file ],
      html5: true,
      volume: this.volumeLevel,
      onplay: (soundId: number) => this.handleOnPlay(soundId, index),
      onpause: (soundId: number) => this.handleOnPause(index),
      onstop: (soundId: number) => this.handleOnPause(index),
      onplayerror : (soundId: number) => error = true,
      onend:  (soundId: number) => this.handleEnd()
    });

    this.checkForPrevious();
    this.playback.play();
    return (!error);
  }

  public removeSongFromQueue(song: Song) {
    this.queueOfSongs.splice(this.queueOfSongs.indexOf(song), 1);
  }

  private checkForPrevious() {
    const check  = this.queueOfSongs.indexOf(this.currentSongPlaying);
    if ( check !== -1) {
      if ( this.previousSongPlaying !== check) {
        this.previousSongPlaying = check;
        this.previousPlaying.next(this.queueOfSongs[this.previousSongPlaying]);
      }
    } else {
      this.previousSongPlaying = undefined;
      this.previousPlaying.next(undefined);
    }
  }

  public nextSong() {
    this.stopCurrentSound();
    const index = this.queueOfSongs.indexOf(this.currentSongPlaying);
    if ( index  !== this.queueOfSongs.length-1) {

      this.playSongFromQueue(index+1);
    } else {
      this.playSongFromQueue(0);
    }
  }

  public previousSong() {
    this.stopCurrentSound();
    const index = this.queueOfSongs.indexOf(this.currentSongPlaying);
    if (index !== 0) {
      this.playSongFromQueue(index-1);
    } else {
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
    this.playback.loop(status,this.currentSoundPlaying);
  }

  public handleOnPlay(soundId:number, index:number) {
    const song = this.queueOfSongs[index];
    song.isPlaying = true;
    this.isPlaying.next(true);
    this.currentlyPlaying.next(song);
    this.isCurrentlyPlaying = true;
    this.currentSoundPlaying = soundId;
    this.currentSongPlaying = this.queueOfSongs[index];

    this.playback.loop(this.isLooping,this.currentSoundPlaying);

  }

  public getDuration() {
    return this.playback.duration(this.currentSoundPlaying);
  }

  private handleOnPause(index) {
    const song = this.queueOfSongs[index];
    song.isPlaying = false;
    this.isCurrentlyPlaying = false;
    this.currentlyPlaying.next(song);
    this.isPlaying.next(false);
  }

  private handleEnd() {
    if ( this.isLooping) {

    } else if (this.toShuffle) {
      this.shuffle();
    } else if ( !this.isLooping) {
      this.nextSong();
    }
  }

  public getSongCurrentlyPlaying() {
    return this.currentSongPlaying;
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

}