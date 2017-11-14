import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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

  public dateOptions: Pickadate.DateOptions = {
    clear: 'Clear', // Clear button text
    close: 'Ok',
    format: 'mmm dd, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    selectMonths: true,
    selectYears: 100,
    max: new Date()

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

