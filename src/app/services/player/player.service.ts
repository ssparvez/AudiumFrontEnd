import { Injectable } from '@angular/core';
import { Song } from '../../classes/Song';
import { Subject } from 'rxjs/Subject';
import { MusicplayerComponent } from '../../components/dashboard/sidenav/musicplayer/musicplayer.component';
@Injectable()
export class PlayerService {

  public songsToLoadSubject = new Subject<any>();
  songsToLoad = this.songsToLoadSubject.asObservable();
  public songsToQueueSubject = new Subject<any>();
  songsToQueue = this.songsToQueueSubject.asObservable();
  public queueIndexSubject = new Subject<number>();
  queueIndex = this.queueIndexSubject.asObservable();
  public songSubject = new Subject<Song>();
  song = this.songSubject.asObservable();

  currentSongQueue: Song[];
  isPlaying: boolean;
  currentQueueIndex: number;

  constructor() {
    this.currentSongQueue = [];
  }

  loadSongs(index: number, songs: Song[]) {
    this.songsToLoadSubject.next({index: index, songs: songs});
    this.queueIndexSubject.next(index);
    this.currentSongQueue = songs;
    this.currentQueueIndex = index;
  }

  queueSongs(songs: Song[]) {
    this.songsToQueueSubject.next(songs);
    this.currentSongQueue = [...this.currentSongQueue, ...songs];
  }
}
