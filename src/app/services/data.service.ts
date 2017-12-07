import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    connectionURL = "http://localhost:8080";
    mediaURL = "https://s3.us-east-2.amazonaws.com/assets.audium.io";
    songUrl = "https://s3.us-east-2.amazonaws.com/assets.audium.io/audio/";
    albumImg = "https://s3.us-east-2.amazonaws.com/assets.audium.io/images/album_arts/";
    //mediaURL = "assets";
    //songUrl = "assets/audio";
    //albumImg = "assets/images/album_arts/";
    profilePic = this.connectionURL + '/profile/';
    public privateSession: boolean = false;
}
