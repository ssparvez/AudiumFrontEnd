import { Injectable } from '@angular/core';
import { Account } from "./Account";

@Injectable()
export class CustomerAccount extends Account {

  private _dob: string;
  private _gender: string;
  private _profilePicURL: string;
  private _followerCount?: number;

  constructor() {
    super();
  }

  get dob(): string {
    return this._dob;
  }

  set dob(value: string) {
    this._dob = value;
  }

  get gender(): string {
    return this._gender;
  }

  set gender(value: string) {
    this._gender = value;
  }

  get profilePicURL(): string {
    return this._profilePicURL;
  }

  set profilePicURL(value: string) {
    this._profilePicURL = value;
  }

  get followerCount(): number {
    return this._followerCount;
  }

  set followerCount(value: number) {
    this._followerCount = value;
  }

  loadWithJSON( json) {
    this.dob = json['_dob'];
    this.username = json['_username'];
    this.firstName = json['_firstName'];
    this.role = json['_role'];
    this.email = json['_email'];
    this.accountId = json['_accountId'];
    this.lastName = json['_lastName'];
    this.gender = json['_gender'];
    this.followerCount = json['_followerCount']
  }
}
