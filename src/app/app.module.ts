// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize';
import { RouterModule, Routes } from '@angular/router';
import {Http, HttpModule, RequestOptions} from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt/angular2-jwt';
import { TimeAgoPipe } from 'time-ago-pipe';
import {MatDialogModule} from "@angular/material";
import {MatMenuModule} from "@angular/material/";
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
import { PaymentInfoComponent } from './modals/payment-info/payment-info.component';
import { ArtistComponent } from './components/dashboard/content/detailed/artist/artist.component';
import { ProfileComponent } from './components/dashboard/content/detailed/profile/profile.component';
import { AlbumComponent } from './components/dashboard/content/detailed/album/album.component';
import { PlaylistComponent } from './components/dashboard/content/detailed/playlist/playlist.component';
import { ChangePasswordComponent } from "./modals/change-password/change-password.component";
import { ConfirmComponent } from './modals/confirm-modal/confirm.component';
import { CreatePlaylistComponent } from './modals/create-playlist/create-playlist.component';

import { InputFormatDirective } from './directives/input-format.directive';
// Services
import { AuthenticationService } from "./services/authentication/authentication.service";
import { PlayerService } from './services/player/player.service';
import { AuthGuard } from "./guards/authguard.service";
import { DataService } from "./services/data.service";
import { CustomerAccount } from "./classes/CustomerAccount";
import { GeneralService } from "./services/general/general.service";
import { SearchComponent } from './components/dashboard/content/search/search.component';
import {ContextMenuModule, ContextMenuService} from "ngx-contextmenu";
import { PlaylistMenuComponent } from './menus/playlist-menu/playlist-menu.component';
import { SongMenuComponent } from './menus/song-menu/song-menu.component';
import { LyricsComponent } from './components/dashboard/content/lyrics/lyrics.component';
import { ChoosePlaylistComponent } from './modals/choose-playlist/choose-playlist.component';


const appRoutes: Routes = [
  {path: "dash", component: DashboardComponent, canActivate: [AuthGuard] ,
  children: [
    {path: "home" , component: HomeComponent},
    {path: "search/:keywords", component: SearchComponent},
    {path: "songs", component: SongsComponent},
    {path: "account", component: AccountComponent},
    {path: "albums", component: AlbumsComponent},
    {path: "artists", component: ArtistsComponent},
    {path: "playlists", component: PlaylistsComponent},
    {path: "song/:id/lyrics", component: LyricsComponent},
    // DETAILED
    {path: "artist/:id", component: ArtistComponent},
    {path: "album/:id", component: AlbumComponent},
    {path: "playlist/:id", component: PlaylistComponent},
    {path: "profile/:id", component: ProfileComponent}
    ]
  },
  {path: "login/:login", component: LoginComponent},
  {path: "", component: FrontPageComponent}
];

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: 'token',
    tokenGetter: (() => localStorage.getItem('token')),
    globalHeaders: [{ 'Content-Type': 'application/json' }],
    noJwtError: true
  }), http, options);
}

@NgModule({
  declarations: [
    // DETAILED
    ArtistComponent,
    AlbumComponent,
    PlaylistComponent,
    ProfileComponent,
    TimeAgoPipe,
    SearchComponent,
    //
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
    FrontPageComponent,
    PaymentInfoComponent,
    InputFormatDirective,
    ChangePasswordComponent,
    ConfirmComponent,
    CreatePlaylistComponent,
    PlaylistMenuComponent,
    SongMenuComponent,
    LyricsComponent,
    ChoosePlaylistComponent,
  ],
  entryComponents: [
    PaymentInfoComponent,
    ChangePasswordComponent,
    ConfirmComponent,
    CreatePlaylistComponent,
    ChoosePlaylistComponent
  ],
  imports: [
    ContextMenuModule,
    MatDialogModule,
    MatMenuModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterializeModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    ContextMenuService,
    GeneralService,
    DataService,
    AuthenticationService,
    PlayerService,
    AuthGuard,
    AuthHttp,
    CustomerAccount,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



