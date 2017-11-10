import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../../services/home/home.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recents: number[];
  genres: Genre[];
  constructor(private homeService : HomeService) { }

  ngOnInit() {
    this.recents = [1,2,3,4,5,6]
    this.homeService.getAllGenres().subscribe((genres) => {
      this.genres = genres;
      console.log(this.genres);
    });
  }
}
interface Genre {
  id: string,
  name: string
}