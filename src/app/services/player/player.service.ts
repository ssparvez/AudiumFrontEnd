import { Injectable } from '@angular/core';
import { Song } from '../../classes/Song';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class PlayerService {

  public songQueueSubject = new Subject<any>();
  songQueue = this.songQueueSubject.asObservable();
  public queueIndexSubject = new Subject<any>();
  queueIndex = this.queueIndexSubject.asObservable();
  public songsToQueueSubject = new Subject<any>();
  songsToQueue = this.songsToQueueSubject.asObservable();

  constructor() { }

  loadSongs(index: number, songs: Song[]) {
    this.songQueueSubject.next(songs);
    this.queueIndexSubject.next(index);
  }

  addSongsToQueue(songs: Song[]) {
    this.songsToQueueSubject.next(songs);
  }
}
