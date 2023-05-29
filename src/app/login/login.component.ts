import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: any;
  userFormGroup!: FormGroup;

  constructor(private fb:FormBuilder, private authService:AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.userFormGroup = this.fb.group({
      username: this.fb.control(null),
      password: this.fb.control(null)
    });
  }

  handleLogin() {

      let username=this.userFormGroup.value.username;
      let password=this.userFormGroup.value.password;

      this.authService.login(username,password).subscribe(
        (appUser:any)=>{
          this.authService.authenticate(appUser).subscribe(
            (data:any)=>{
              this.router.navigateByUrl("/admin");
            },
            (error)=>{
              this.errorMessage="Incorrect Username or Password !!!";
            }
          );
        },
        (error)=>{
          this.errorMessage="Incorrect Username or Password !!!";
        }
      )



  }
}
