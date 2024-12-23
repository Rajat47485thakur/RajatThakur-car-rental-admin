import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    public SERVER: ApiService,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser")),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.SERVER.POST_DATA(this.SERVER.END_POINT.adminLogin, {
      email: username,
      password: password,
    }).pipe(
      map((user) => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        user.authdata = window.btoa(username + ":" + password);
        localStorage.setItem("currentUser", JSON.stringify(user.data));
        this.currentUserSubject.next(user);
        return user;
      }),
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    window.location.reload();
  }
}
