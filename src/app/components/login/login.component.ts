import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean;
  registerCheck: String;

  public dateOptions: Pickadate.DateOptions = {
    clear: 'Clear', // Clear button text
    close: 'Ok',
    format: 'mmm dd, yyyy',
    formatSubmit: 'mm-dd-yyy',
    selectMonths: true,
    selectYears: 100,
    max: new Date()

  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  this.route.paramMap.subscribe(param => {
    if (param.get('register') === 'false') {
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
            this.invalidLogin = false;
            this.router.navigate(['/dash/home']);
          } else {
            this.invalidLogin = true;
          }
        });
    }
  }


  signUp(formValues) {

    console.log(formValues.value);
  }


}

