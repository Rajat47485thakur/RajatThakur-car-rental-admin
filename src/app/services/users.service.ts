import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "../models";
@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`/users`);
  }
}
