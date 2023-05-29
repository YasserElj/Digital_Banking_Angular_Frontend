import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../model/customer.model";
import {AccountDetails} from "../model/account.model";
import {AccountsService} from "../services/accounts.service";
import {Observable} from "rxjs";
import {CustomerService} from "../services/customer.service";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent {
  customerID!: string;
  customer!:Customer;
  accounts!: Observable<Array<AccountDetails>>

  constructor(private route : ActivatedRoute, private router : Router, private customerService: CustomerService, public authService : AuthenticationService) {
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer;

  }

  ngOnInit(): void {
    this.customerID = this.route.snapshot.params['id'];
    this.handleCustomerAccounts();

  }
  handleCustomerAccounts() {
    this.accounts=this.customerService.getAccounts(this.customerID);
  }

  handleAccount(account: AccountDetails) {
    this.router.navigateByUrl("/admin/accounts", {state: account});
  }
}
