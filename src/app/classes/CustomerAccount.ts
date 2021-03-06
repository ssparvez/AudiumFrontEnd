import { Injectable } from '@angular/core';
import { Account } from "./Account";
import { UserPreferences } from "./UserPreferences";

@Injectable()
export class CustomerAccount extends Account {

  private _dob: string;
  private _gender: string;
  private _profilePicURL: string;
  private _followerCount?: number;
  private _bio?: string;

  constructor() {
    super();
  }

  public logout(): void {
    this.username = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.accountId = null;
    this.role = null;
    this.isActive = null;

    this.userPreferences.accountId = null;
    this.userPreferences.language = UserPreferences.DEFAULT_language;
    this.userPreferences.publicProfile = true;
    this.userPreferences.defaultPublicSession = true;
    this.userPreferences.showExplicitContent = true;
    this.userPreferences.quality = UserPreferences.DEFAULT_quality;

    this.dob = null;
    this.gender = null;
    this.profilePicURL = null;
    this.followerCount = null;
    this.bio = null;
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


  get bio(): string {
    return this._bio;
  }

  set bio(value: string) {
    this._bio = value;
  }

  loadWithJSON(json) {
    this.dob = json['_dob'];
    this.username = json['_username'];
    this.firstName = json['_firstName'];
    this.role = json['_role'];
    this.email = json['_email'];
    this.accountId = json['_accountId'];
    this.lastName = json['_lastName'];
    this.gender = json['_gender'];
    this.followerCount = json['_followerCount'];
  }

  public loadPreferencesWithJSON(json): void {
    this.userPreferences.accountId = json['accountId'];
    this.userPreferences.language = json['language'];
    this.userPreferences.publicProfile = json['publicProfile'];
    this.userPreferences.defaultPublicSession = json['defaultPublicSession'];
    this.userPreferences.showExplicitContent = json['showExplicitContent'];
    this.userPreferences.quality = json['quality'];
  }
}
