import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

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
    //  private authService: AuthService
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
      console.log(values);
      this.invalidLogin = false;
      this.router.navigate(['/dash']);

    }
  }


  signUp(formValues) {

    console.log(formValues.value);
  }


  /**signIn(credentials) {
    this.authService.login(credentials)
      .subscribe(result => {
        if (result) {
          //let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/']);
        } else {
          this.invalidLogin = true;
        }
      });
  }**/


}

