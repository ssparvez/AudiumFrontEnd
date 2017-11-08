import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    connectionURL = "http://localhost:8080";
    profilePic = this.connectionURL + '/profile/';
}
