import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../model/account.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup! : FormGroup;
  currentPage : number =0;
  pageSize : number =5;
  accountObservable! : Observable<AccountDetails>
  operationFormGroup! : FormGroup;
  errorMessage! :string ;

  accountDetails! : AccountDetails

  constructor(private route : ActivatedRoute, private router : Router,private fb:FormBuilder, private accountService:AccountsService, public authService : AuthenticationService ) {
    if(this.router.getCurrentNavigation()?.extras.state){
      this.accountDetails = this.router.getCurrentNavigation()?.extras.state as AccountDetails;
      this.accountObservable = this.accountService.getAccount(this.accountDetails.accountId, this.currentPage, this.pageSize);
    }
  }

  ngOnInit(): void {
    this.accountFormGroup=this.fb.group({
      accountId : this.fb.control(null)
    });
    this.operationFormGroup=this.fb.group({
      operationType : this.fb.control(null),
      amount : this.fb.control(0),
      description : this.fb.control(null),
      accountDestination : this.fb.control(null)
    })

  }

  handleSearchAccount() {
    let accountId : string =this.accountFormGroup.value.accountId;
    this.accountObservable=this.accountService.getAccount(accountId,this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err);
      })
    );

  }

  gotoPage(page: number) {
    this.currentPage=page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId :string = this.accountFormGroup.value.accountId;
    let operationType=this.operationFormGroup.value.operationType;
    let amount :number =this.operationFormGroup.value.amount;
    let description :string =this.operationFormGroup.value.description;
    let accountDestination :string =this.operationFormGroup.value.accountDestination;
    if(operationType=='DEBIT'){
      this.accountService.debit(accountId, amount,description).subscribe({
        next : (data)=>{
          alert("Debit avec succes");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });
    } else if(operationType=='CREDIT'){
      this.accountService.credit(accountId, amount,description).subscribe({
        next : (data)=>{
          alert("Credit avec succes");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });
    }
    else if(operationType=='TRANSFER'){
      this.accountService.transfer(accountId,accountDestination, amount,description).subscribe({
        next : (data)=>{
          alert("Success Transfer");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });

    }
  }
}