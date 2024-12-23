import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import * as constant from "./constants";
import { apiUrl } from "./apiUrls";
import { NgxSpinnerService } from "ngx-spinner";
/* import {ToastrService} from 'ngx-toastr'; */
/* import {ToastrService} from 'ngx-toastr';
import {Lightbox} from 'ngx-lightbox';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal'; */
import { Location } from "@angular/common";
import { AuthenticationService } from "../services/authentication.service";
import { User } from "../models";
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
declare var jQuery: any;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public readonly API_SERVER: String;
  public readonly END_POINT: any;
  private subject = new BehaviorSubject<any>(null);
  public title = this.subject.asObservable();

  private loaderSubject = new BehaviorSubject<any>(null);
  public loaderStatus = this.loaderSubject.asObservable();

  constant = constant;
  currentLanugae: any = "en";
  apiLoader: boolean = false;
  isSubmitting: boolean;
  currentUser: User;
  constructor(
    private router: Router,
    private http: HttpClient,
    private location: Location,
    private spinner: NgxSpinnerService,
    /* public toastr: ToastrService,
    public lightBox: Lightbox,
    public modalService: BsModalService, */
    private authenticationService: AuthenticationService,
  ) {
    this.API_SERVER = environment.API_SERVER;
    this.END_POINT = apiUrl;
    this.isSubmitting = false;
  }
  private handleError(error: HttpErrorResponse) {
    // this.spinner.hide();
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      // this.spinner.hide();
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      // this.spinner.hide();
    }
    // Return an observable with a user-facing error message.
    this.spinner.hide();
    return throwError('Something bad happened; please try again later.');

  }

  private addAuthorizationHeader(): HttpHeaders {
    const userData: any = localStorage.getItem('currentUser');
    const accessToken = userData ? JSON.parse(userData).accessToken : null;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': accessToken ? `${accessToken}` : ''
    });
  }

  GET_DATA(url: string, obj: any, loader?: boolean): Observable<any> {
    let params = new HttpParams();
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== '' && obj[key] !== undefined) {
        params = params.set(key, obj[key]);
      }
    });
    return this.http.get<any>(`${this.API_SERVER}${url}`, {
      params: params,
      reportProgress: false
    }).pipe(
      catchError(this.handleError)
    );
  }

  POST_DATA(url: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.API_SERVER}${url}`, data, {
      reportProgress: false
    }).pipe(
      catchError(this.handleError)
    );
  }

  GET_DATA2(url: string, obj: any, loader?: boolean): Observable<any> {
    // console.log(url)
    const headers = this.addAuthorizationHeader();
    let params = new HttpParams();
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== '' && obj[key] !== undefined) {
        if (Array.isArray(obj[key])) {
          params = params.set(key, JSON.stringify(obj[key]));
        } else {
          params = params.set(key, obj[key]);
        }
      }
    });
    /*  return this.http.get<any>(`${this.API_SERVER}${url}`, {
       params: params,
       reportProgress: loader,
       headers: headers
     }).pipe(
       catchError(this.handleError)
     ); */
    let needToCheckStatus = true;

    if (needToCheckStatus) {
      return new Observable(observer => {
        this.http.get<any>(this.API_SERVER + this.END_POINT.adminPermissionCheck, { headers: headers }).subscribe((response) => {
          const userData2: any = localStorage.getItem('currentUser');
          var newData = JSON.parse(userData2);
          var isReloadWindow = false;
          if (newData.existingUser.adminPermission.length != response.data.adminPermission.length) {
            isReloadWindow = true;
          }
          newData.existingUser.adminPermission = response.data.adminPermission;
          localStorage.setItem("currentUser", JSON.stringify(newData));

          if (isReloadWindow) {
            window.location.reload();
          }
          this.makeOriginalAPICall(url, params, loader, headers).subscribe(
            observer.next.bind(observer),
            observer.error.bind(observer),
            observer.complete.bind(observer)
          );
        }, (error) => {
          console.error("Error occurred while checking admin status:", error);
          observer.error(error);
        });
      });
    } else {
      return this.makeOriginalAPICall(url, params, loader, headers);
    }

  }
  makeOriginalAPICall(url, params, loader, headers): Observable<any> {
    return this.http.get<any>(`${this.API_SERVER}${url}`, {
      params: params,
      reportProgress: loader,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  POST_DATA2(url: string, data: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    return this.http.post<any>(`${this.API_SERVER}${url}`, data, {
      reportProgress: false,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  REJECT_DOCUMENT(url: string, data: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    return this.http.put<any>(`${this.API_SERVER}${url}`, data, {
      reportProgress: false,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }
  REJECT_DOCUMENT2(url: string, data: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    return this.http.patch<any>(`${this.API_SERVER}${url}`, data, {
      reportProgress: false,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }
  UPDATE2(url: string, data: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    return this.http.patch<any>(`${this.API_SERVER}${url}`, data, {
      reportProgress: false,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }
  DELETE2(url: string, data: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    return this.http.patch<any>(`${this.API_SERVER}${url}`, data, {
      reportProgress: false,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }
  // POST_DATA_WITH_HEADER_PROFILE_UPLOAD(url: string, data: any): Observable<any> {
  //   const headers = this.addAuthorizationHeader();
  //   return this.http.post<any>(`${this.API_SERVER}${url}`, data, {
  //     reportProgress: false,
  //     headers: headers
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  POST_DATA_WITH_HEADER_PROFILE_UPLOAD(url: string, data: any) {
    var userData: any = localStorage.getItem("currentUser");
    userData = JSON.parse(userData);
    let headers = new HttpHeaders({
      /*  'Content-Type': 'application/json', */
      Authorization: `${userData.accessToken}`,
    });

    return this.http.post<any>(this.API_SERVER + url, data, {
      reportProgress: false,
      headers: headers,
    });
  }
  APPROVED_DOCUMENT(url: string, data: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    return this.http.put<any>(`${this.API_SERVER}${url}`, data, {
      reportProgress: false,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  // GET_DATA(url, obj, loader?) {
  //   let params = new HttpParams();
  //   Object.keys(obj).forEach((key) => {
  //     if (obj[key] !== "" && obj[key] !== undefined) {
  //       params = params.set(key, obj[key]);
  //     }
  //   });
  //   return this.http.get<any>(this.API_SERVER + url, {
  //     params: params,
  //     reportProgress: false,
  //   }).pipe(
  //     catchError(this.handleError)
  //   );;
  // }

  // POST_DATA(url: string, data: any) {
  //   return this.http.post<any>(this.API_SERVER + url, data, {
  //     reportProgress: false,
  //   }).pipe(
  //     catchError(this.handleError)
  //   );;
  // }

  // GET_DATA2(url, obj, loader?) {
  //   var userData: any = localStorage.getItem("currentUser");
  //   userData = JSON.parse(userData);
  //   let headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: `${userData.accessToken}`,
  //   });
  //   let params = new HttpParams();
  //   Object.keys(obj).forEach((key) => {
  //     if (obj[key] !== "" && obj[key] !== undefined) {
  //       if (Array.isArray(obj[key])) {
  //        params = params.set(key, JSON.stringify(obj[key]));
  //       } else {
  //         params = params.set(key, obj[key]);
  //       }

  //     }
  //   });
  //   return this.http.get<any>(this.API_SERVER + url, {
  //     params: params,
  //     reportProgress: loader,
  //     headers: headers,
  //   }).pipe(
  //     catchError(this.handleError)
  //   );;
  // }

  // POST_DATA2(url: string, data: any) {
  //   var userData: any = localStorage.getItem("currentUser");
  //   userData = JSON.parse(userData);
  //   let headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: `${userData.accessToken}`,
  //   });
  //   return this.http.post<any>(this.API_SERVER + url, data, {
  //     reportProgress: false,
  //     headers: headers,
  //   }).pipe(
  //     catchError(this.handleError)
  //   );;
  // }

  // REJECT_DOCUMENT(url: string, data: any) {
  //   var userData: any = localStorage.getItem("currentUser");
  //   userData = JSON.parse(userData);
  //   let headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: `${userData.accessToken}`,
  //   });
  //   return this.http.put<any>(this.API_SERVER + url, data, {
  //     reportProgress: false,
  //     headers: headers,
  //   }).pipe(
  //     catchError(this.handleError)
  //   );;
  // }
  // POST_DATA_WITH_HEADER_PROFILE_UPLOAD(url: string, data: any) {
  //   var userData: any = localStorage.getItem("currentUser");
  //   userData = JSON.parse(userData);
  //   let headers = new HttpHeaders({
  //     /*  'Content-Type': 'application/json', */
  //     Authorization: `${userData.accessToken}`,
  //   });

  //   return this.http.post<any>(this.API_SERVER + url, data, {
  //     reportProgress: false,
  //     headers: headers,
  //   }).pipe(
  //     catchError(this.handleError)
  //   );;
  // }
  // APPROVED_DOCUMENT(url: string, data: any) {
  //   var userData: any = localStorage.getItem("currentUser");
  //   userData = JSON.parse(userData);
  //   let headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: `${userData.accessToken}`,
  //   });
  //   return this.http.put<any>(this.API_SERVER + url, data, {
  //     reportProgress: false,
  //     headers: headers,
  //   }).pipe(
  //     catchError(this.handleError)
  //   );;
  // }


  GET_CUSTOMER_LIST(url: string, params: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    const httpParams = new HttpParams({ fromObject: params });
  
    return this.http.get<any>(`${this.API_SERVER}${url}`, {
      params: httpParams,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }  

  GET_CUSTOMER_BY_ID(url: string, params: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    const httpParams = new HttpParams({ fromObject: params });
  
    return this.http.get<any>(`${this.API_SERVER}${url}`, {
      params: httpParams,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }  

  GET_VEHICLE_LIST(url: string, params?: any): Observable<any> {
    const headers = this.addAuthorizationHeader();
    const httpParams = new HttpParams({ fromObject: params });
  
    return this.http.get<any>(`${this.API_SERVER}${url}`, {
      params: httpParams,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }  
}
