// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavComponent } from './components/dashboard/sidenav/sidenav.component';
import { MusicplayerComponent } from './components/dashboard/sidenav/musicplayer/musicplayer.component';
import { ContentComponent } from './components/dashboard/content/content.component';
import { HomeComponent } from './components/dashboard/content/home/home.component';
import { SongsComponent } from './components/dashboard/content/library/songs/songs.component';
import { AlbumsComponent } from './components/dashboard/content/library/albums/albums.component';
import { ArtistsComponent } from './components/dashboard/content/library/artists/artists.component';
import { PlaylistsComponent } from './components/dashboard/content/library/playlists/playlists.component';
import { AccountComponent } from './components/dashboard/content/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { FrontPageComponent } from './components/front-page/front-page.component';
// Servicesgit pull
import { SongsService } from "./services/songs/songs.service";
import { AuthenticationService } from "./services/authentication/authentication.service";
import { AuthGuard } from "./guards/authguard.service";
import { DataService } from "./services/data.service";
import { AuthHttp } from 'angular2-jwt/angular2-jwt';

const appRoutes: Routes = [
  {path: "dash", component: DashboardComponent, canActivate: [AuthGuard] ,
  children: [
    {path: "home" , component: HomeComponent},
    {path: "songs", component: SongsComponent},
    {path: "account", component: AccountComponent},
    {path: "albums", component: AlbumsComponent},
    {path: "artists", component: ArtistsComponent},
    {path: "playlists", component: PlaylistsComponent}
    ]

  },
  {path: "login/:login", component: LoginComponent},
  {path: "", component: FrontPageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ContentComponent,
    SongsComponent,
    AlbumsComponent,
    ArtistsComponent,
    HomeComponent,
    PlaylistsComponent,
    DashboardComponent,
    AccountComponent,
    MusicplayerComponent,
    LoginComponent,
    FrontPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterializeModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    DataService,
    SongsService,
    AuthenticationService,
    AuthGuard,
    AuthHttp
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



