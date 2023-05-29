import { Injectable } from '@angular/core';
import {AppUser} from "../model/user.model";
import {Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  users : AppUser[] = [];
  authenticatedUser!: AppUser;
  constructor() {
    this.users.push({userId:"1",username:"admin",password:"1234",roles:["USER","ADMIN"]});
    this.users.push({userId:"2",username:"user1",password:"1234",roles:["USER"]});
    this.users.push({userId:"3",username:"user2",password:"1234",roles:["USER"]});
  }

  public login(username:string, password:string):Observable<AppUser> {
    let appUser = this.users.find(user => user.username == username && user.password == password);
    if(!appUser || appUser.password!=password){
      return throwError(() =>new Error("Username or password False "));

    }
    return of(appUser);

  }

  public authenticate(appUser:AppUser):Observable<boolean>{
    this.authenticatedUser = appUser;
    sessionStorage.setItem("authenticatedUser", JSON.stringify({username:appUser.username, role:appUser.roles, jwt:"JWT_TOKEN"}));
    return of(true);
  }
  public isAuthenticated():boolean{
    return this.authenticatedUser != undefined;
  }
  public hasRole(role:string):boolean{
    if(this.authenticatedUser){
      return this.authenticatedUser.roles.includes(role);
    }
    return false;
  }


  public logout() : Observable<boolean>{
    sessionStorage.removeItem("authenticatedUser");
    this.authenticatedUser != undefined;
    return of(true);
  }

}
