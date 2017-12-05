// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from "./routing/custom-reuse-strategy";
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt/angular2-jwt';
import { TimeAgoPipe } from 'time-ago-pipe';
import { MatDialogModule } from "@angular/material";
import { MatMenuModule } from "@angular/material/";
import {NgxChartsModule} from "@swimlane/ngx-charts"
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
import { PlaylistMenuComponent } from './menus/playlist-menu/playlist-menu.component';
import { SongMenuComponent } from './menus/song-menu/song-menu.component';
import { LyricsComponent } from './components/dashboard/content/lyrics/lyrics.component';
import { ChoosePlaylistComponent } from './modals/choose-playlist/choose-playlist.component';
import { ArtistMenuComponent } from './menus/artist-menu/artist-menu.component';
import { AlbumMenuComponent } from './menus/album-menu/album-menu.component';
import { AdminSidenavComponent } from "./components/dashboard/sidenav/admin-sidenav/admin-sidenav.component";
import { AdminHomeComponent } from './components/dashboard/content/admin/admin-home/admin-home.component';
import { QueueComponent } from './components/dashboard/content/queue/queue.component';
import { SearchComponent } from './components/dashboard/content/search/search.component';
import { InputFormatDirective } from './directives/input-format.directive';
import { AdminAccountsComponent } from './components/dashboard/content/admin/admin-accounts/admin-accounts.component';
import { AdminContentComponent } from "./components/dashboard/content/admin/admin-content/admin-content.component";
import { AccountsComponent } from "./modals/admin/accounts/accounts.component";
import { ArtistHomeComponent } from "./components/dashboard/content/artist/artist-home/artist-home.component";
import { ArtistSidenavComponent } from "./components/dashboard/sidenav/artist-sidenav/artist-sidenav.component";
import { EntityCardComponent } from './components/layout/collections/entity-card/entity-card.component';
import { GenreCardComponent } from './components/layout/collections/genre-card/genre-card.component';

// Services
import { AuthenticationService } from "./services/authentication/authentication.service";
import { PlayerService } from './services/player/player.service';
import { AuthGuard } from "./guards/authguard.service";
import { DataService } from "./services/data.service";
import { CustomerAccount } from "./classes/CustomerAccount";
import { GeneralService } from "./services/general/general.service";
import { ContextMenuModule, ContextMenuService } from "ngx-contextmenu";
import { ContentAddComponent } from './modals/admin/content-add/content-add.component';
import { SongSearchComponent } from './modals/admin/search/song-search/song-search.component';
import { ContentInputComponent } from './modals/admin/search/content-input/content-input.component';
import { AdminArtistsComponent } from './components/dashboard/content/admin/admin-artists/admin-artists.component';
import { AdminArtistsConsoleComponent } from './modals/admin/admin-artists-console/admin-artists-console.component';
import { ArtistSearchComponent } from './modals/admin/search/artist-search/artist-search.component';
import { AdminModifyProfilesComponent } from './modals/admin/admin-modify-profiles/admin-modify-profiles.component';
import { AlbumSearchComponent } from './modals/admin/search/album-search/album-search.component';
import { ArtistContentComponent } from './components/dashboard/content/artist/artist-content/artist-content.component';
import { ArtistAccountComponent } from './components/dashboard/content/artist/artist-account/artist-account.component';
import { ArtistAccount } from './classes/ArtistAccount';
import { ArtistContentSongsComponent } from './components/dashboard/content/artist/artist-content/artist-content-songs/artist-content-songs.component';
import { ArtistRoyaltiesComponent } from './components/dashboard/content/artist/artist-royalties/artist-royalties.component';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

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
    {path: "queue", component: QueueComponent},
    // ADMIN
    {path: "admin-home" , component: AdminHomeComponent},
    {path: "admin-accounts" , component: AdminAccountsComponent},
    {path: "admin-content" , component: AdminContentComponent},
    {path: "admin-artists" , component: AdminArtistsComponent},
    // ARTIST
    {path: "artist-home" , component: ArtistHomeComponent},
    {path: "artist-content" , component: ArtistContentComponent},
    {path: "artist-content-songs/:id" , component: ArtistContentSongsComponent},
    {path: "artist-account" , component: ArtistAccountComponent},
	{path: "artist-royalties" , component: ArtistRoyaltiesComponent},

    // DETAILED
    {path: "artist/:id", component: ArtistComponent},
    {path: "album/:id", component: AlbumComponent},
    {path: "playlist/:id", component: PlaylistComponent},
    {path: "profile/:id", component: ProfileComponent},
  ]
  },
  {path: "login/:login", component: LoginComponent},
  {path: "", component: FrontPageComponent},
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
    ArtistMenuComponent,
    AlbumMenuComponent,
    AdminSidenavComponent,
    AdminHomeComponent,
    QueueComponent,
    AdminAccountsComponent,
    AccountsComponent,
    AdminContentComponent,
    ContentAddComponent,
    SongSearchComponent,
    ContentInputComponent,
    AdminArtistsComponent,
    AdminArtistsConsoleComponent,
    ArtistSearchComponent,
    AdminModifyProfilesComponent,
    AlbumSearchComponent,
    ArtistHomeComponent,
    ArtistSidenavComponent,
    ArtistContentComponent,
    ArtistAccountComponent,
    ArtistContentSongsComponent,
    EntityCardComponent,
    GenreCardComponent,
    SafeHtmlPipe,
	ArtistRoyaltiesComponent,
  ],
  entryComponents: [
    PaymentInfoComponent,
    ChangePasswordComponent,
    ConfirmComponent,
    CreatePlaylistComponent,
    ChoosePlaylistComponent,
    AccountsComponent,
    ContentAddComponent,
    SongSearchComponent,
    ContentInputComponent,
    AdminArtistsConsoleComponent,
    ArtistSearchComponent,
    AlbumSearchComponent,
    AdminModifyProfilesComponent
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
    NgxChartsModule
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
    ArtistAccount,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    /*{
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



