import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { Renderer2 } from '@angular/core';
import { register } from "ts-node/dist";
import { GeneralService } from "../../services/general/general.service";
import { AppError } from "../../errors/AppError";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private suspended: boolean;
  invalidLogin: boolean;
  registrationCheck = true;
  registerCheck: String;
  now = new Date();
  fN: string;
  lN: string;

  public dateOptions: Pickadate.DateOptions = {
    clear: 'Clear', // Clear button text
	  today: '',
    close: 'Ok',
    format: 'mmm dd, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    selectMonths: true,
    selectYears: 120,
    max: new Date(this.now.getFullYear() - 13, this.now.getMonth(), this.now.getDate()),
    onOpen: function() {
      // Disable password fields to fix Chrome bug that makes date picker close too soon
	  (<HTMLInputElement>document.getElementById('password')).disabled = true;
	  (<HTMLInputElement>document.getElementById('password-signin')).disabled = true;
    },
    onClose: function() {
      // Re-enable password fields
	  (<HTMLInputElement>document.getElementById('password')).disabled = false;
	  (<HTMLInputElement>document.getElementById('password-signin')).disabled = false;
    },
    closeOnClear: false,
	closeOnSelect: false
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private renderer: Renderer2,
    private service: GeneralService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.route.paramMap.subscribe(param => {

    if (param.get('login') === 'false') {
      this.registerCheck = 'true';
    }
    });
  }

  login(values) {
    console.log(values);
    if (values.password === "" || values.username === "") {
      this.invalidLogin = true;
    } else {
      this.authService.login(values)
        .subscribe(correctInfo => {
          if (correctInfo === 1) {
            const currentAccountRole =  JSON.parse(sessionStorage.getItem("currentUser"))['_role'];
            this.renderer.selectRootElement('form').style.display = 'none';
            this.invalidLogin = false;
            this.suspended = false;
            if ( currentAccountRole === "Admin" ) {
              this.router.navigate(['/dash/admin-home']);
            }
            else if( currentAccountRole === "Artist") {
              this.router.navigate(['/dash/artist-home']);
            }
            else {
              this.router.navigate(['/dash/home']);
            }

          } else if ( correctInfo === 0) {
            this.invalidLogin = true;
          } else if ( correctInfo === 2) {
            this.suspended = true;
          }
        });
    }
  }

  signUp(values) {
     this.service.post('/register',values).subscribe(
       response => {
         this.registrationCheck = true;
         this.registerCheck = 'false';
         this.router.navigate(['/login/true']);
         location.reload();
       }, ( error: AppError) => {
         this.registrationCheck = false;
       }
     );
  }

  formatFirstLetterFN() {
    const value = this.fN;
    if ( value !== undefined) {
      this.fN = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }

  formatFirstLetterLN() {
    const value = this.lN;
    if ( value !== undefined) {
      this.lN = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }

}

