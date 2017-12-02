import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    connectionURL = "http://localhost:8080";
    //mediaURL = "https://s3.us-east-2.amazonaws.com/assets.audium.io";
    mediaURL = "assets";
    profilePic = this.connectionURL + '/profile/';
}
