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
  private queueOfSongs: Song[];
  private isCurrentlyPlaying: boolean;
  public currentSoundPlaying: number;
  private previousSongPlaying: number;
  private currentSongPlaying: number;

  constructor(private dataService: DataService) {

  }

  public loadSongQueue(songs: Song[]) {
    this.queueOfSongs = songs;
  }

  public playSong(song: Song) {
    let error: boolean;
    this.queueOfSongs = [];
    this.queueOfSongs.unshift(song);
    this.playback = new Howl({
      src: [this.dataService.songUrl + song.file ],
      html5: true,
      volume: 0.2,
      onplay: (soundId: number) => this.handleOnPlay(soundId, 0),
      onpause: (soundId: number) => this.handleOnPause(),
      onplayerror : (soundId: number) => error = true,
      onend:  (soundId: number) => this.nextSong()
    });
    this.playback.play();
    return (!error);
  }

  public playSongFromQueue(index: number) {
    console.log(this.queueOfSongs);
    let error: boolean;
    if ( this.currentSoundPlaying !== undefined) {
      this.playback.stop(this.currentSoundPlaying);
    }
    this.playback = new Howl({
      src: [this.dataService.songUrl + this.queueOfSongs[index].file ],
      html5: true,
      volume: 0.2,
      onplay: (soundId: number) => this.handleOnPlay(soundId, index),
      onpause: (soundId: number) => this.handleOnPause(),
      onplayerror : (soundId: number) => error = true,
      onend:  (soundId: number) => this.nextSong()
    });

    this.checkForPrevious();

    this.playback.play();
    return (!error);
  }

  public removeSongFromQueue(song: Song) {
    this.queueOfSongs.splice(this.queueOfSongs.indexOf(song), 1);
  }

  private checkForPrevious() {
    if ( this.previousSongPlaying !== this.currentSongPlaying) {
      this.previousSongPlaying = this.currentSongPlaying;
      this.previousPlaying.next(this.queueOfSongs[this.previousSongPlaying]);
    }
  }
  public nextSong() {
    const index = this.currentSongPlaying;
    if ( index  !== this.queueOfSongs.length-1) {

      this.playSongFromQueue(index+1);
    } else {
      this.playSongFromQueue(0);
    }
  }

  public previousSong() {
    const index = this.currentSongPlaying;
    if (index !== 0) {
      this.playSongFromQueue(index-1);
    } else {
      this.playSongFromQueue(this.queueOfSongs.length-1);
    }
  }


  public resumePlay() {
  this.playback.play(this.currentSoundPlaying);
  }

  pause() {
    this.playback.pause(this.currentSoundPlaying);
  }

  public setSeek(value) {
    this.playback.seek(value, this.currentSoundPlaying);
  }

  public getSeek() {
    return +this.playback.seek(this.currentSoundPlaying);
  }

  public setVolume(volumeLevel) {
    this.playback.volume(volumeLevel, this.currentSoundPlaying);
  }

  public getVolume(): number {
    return +this.playback.volume(this.currentSoundPlaying);
  }


  public mute(condition) {
    this.playback.mute(condition,this.currentSoundPlaying);
  }

  public shuffle() {
    let randomNumber = this.randomIntFromInterval(0,this.queueOfSongs.length-1);
    while ( randomNumber === this.currentSongPlaying) {
      randomNumber = this.randomIntFromInterval(0,this.queueOfSongs.length-1);
    }
    this.playSongFromQueue(randomNumber);
  }

  public repeat(status) {
    this.playback.loop(status,this.currentSoundPlaying);
  }

  public  handleOnPlay(soundId:number, index:number) {
    this.isPlaying.next(true);
    this.currentlyPlaying.next(this.queueOfSongs[index]);
    this.isCurrentlyPlaying = true;
    this.currentSoundPlaying = soundId;
    this.currentSongPlaying = index;
  }

  public getDuration() {
    return this.playback.duration(this.currentSoundPlaying);
  }

  handleOnPause() {
    this.isPlaying.next(false);
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

}
