import { Injectable } from '@angular/core';
import { Account } from "./Account";

@Injectable()
export class ArtistAccount extends Account {

  private _followerCount?: number;
  private _bio?: string;

  constructor() {
    super();
  }

  get followerCount(): number {
    return this._followerCount;
  }

  set followerCount(value: number) {
    this._followerCount = value;
  }


  get bio(): string {
    return this._bio;
  }

  set bio(value: string) {
    this._bio = value;
  }

  loadWithJSON( json) {
    this.username = json['_username'];
    this.firstName = json['_firstName'];
    this.role = json['_role'];
    this.email = json['_email'];
    this.accountId = json['_accountId'];
    this.lastName = json['_lastName'];
    this.followerCount = json['_followerCount'];
  }
}
