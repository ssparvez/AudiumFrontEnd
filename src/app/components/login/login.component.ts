import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Renderer2} from '@angular/core';
import {register} from "ts-node/dist";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean;
  registrationCheck = true;
  registerCheck: String;
  now = new Date();
  
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
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
    
    if (param.get('login') === 'false') {
      this.registerCheck = 'true';
    }
    });
  }

  login(values) {
    if (values.password === "" || values.username === "") {
      this.invalidLogin = true;
    } else {
      this.authService.login(values)
        .subscribe(correctInfo => {
          if (correctInfo) {
            // let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            // this.router.navigate([returnUrl || '/']);
            /* Hiding the login form triggers the "Save password?" prompt on many newer browsers */
            this.renderer.selectRootElement('form').style.display = 'none';
            this.invalidLogin = false;
            this.router.navigate(['/dash/home']);
          } else {
            this.invalidLogin = true;
          }
        });
    }
  }

  signUp(values) {
    if (this.authService.register(values)) {
      this.registrationCheck = true;
      this.registerCheck = 'false';
      this.router.navigate(['/login/true']);
      location.reload();
    } else {
      this.registrationCheck = false;
    }
  }

}

