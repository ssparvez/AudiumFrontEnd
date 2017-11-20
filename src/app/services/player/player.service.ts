import { Injectable } from '@angular/core';
import { Song } from '../../classes/Song';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class PlayerService {

  public songSubject = new Subject<any>();
  songQueue = this.songSubject.asObservable();
  constructor() { }

  playSongs(songId: number, songs : Song[]) {
    this.songSubject.next(songs);
  }

}
