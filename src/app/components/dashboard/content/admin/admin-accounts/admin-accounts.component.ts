import { Component, OnInit } from '@angular/core';
import {AccountsComponent} from "../../../../../modals/admin/accounts/accounts.component";
import {MzToastService} from "ng2-materialize";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {

  private currentUser;
  private currentAdminId;

  constructor(private dialog: MatDialog,
              private toastService: MzToastService) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAdminId = this.currentUser['_accountId'];
  }

  ngOnInit() {
  }

  openDeleteAccountWindow() {
    this.dialog.open(AccountsComponent, {
      data: {
        adminId: this.currentAdminId,
        toDeleteAccount: true
      }
    })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.toastService.show("Account was deleted", 3000, 'blue');
        }
      });
  }


  openCreateAccountWindow() {
    this.dialog.open(AccountsComponent, {
      data: {
        adminId: this.currentAdminId,
        toaddAccount: true
      }
    })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.toastService.show("Account was created", 3000, 'blue');
        }
      });
  }
}
