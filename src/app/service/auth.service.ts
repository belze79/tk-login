import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, concatMap, map, Observable, of, throwError } from 'rxjs';
import { RequestUrl, StorageKey } from '../enums/http-key';

interface ApiResponse{
  message : {
    accessToken : string,
    refreshToken : string
  },
  success : boolean
}

interface CheckLogin{
  isLogin : boolean
}

export interface NewTokens{
  newAccessToken : string,
  newRefreshToken : string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly dbUrl : string = RequestUrl.testDbUrl //RequestUrl.dbUrl
  private roleBS : BehaviorSubject<string> = new BehaviorSubject<string>("")
  private usernameBS : BehaviorSubject<string> = new BehaviorSubject<string>("")
  username$ : Observable<string> = this.usernameBS.asObservable()

  constructor(private http : HttpClient, private router : Router) {
    this.username = this.username
    this.role = this.role
    this.loginCheck = this.loginCheck
  }

  private getSessionStorage(key : string) : string | null{
    return sessionStorage.getItem(key)
  }

  private setSessionStorage(key : string, value : string) : void{
    sessionStorage.setItem(key, value)
  }

  get accessToken() : string{
    return this.getSessionStorage(StorageKey.accessToken) || ""
  }

  set accessToken(token : string){
    this.setSessionStorage(StorageKey.accessToken, token)
  }

  get refreshToken() : string{
    return this.getSessionStorage(StorageKey.refreshToken) || ""
  }

  set refreshToken(token : string){
    this.setSessionStorage(StorageKey.refreshToken, token)
  }

  get role() : string{
    return this.getSessionStorage(StorageKey.role) || ""
  }

  set role(role : string){
    this.roleBS.next(role)
    if(role) this.setSessionStorage(StorageKey.role, role)
  }

  get username() : string{
    return this.getSessionStorage(StorageKey.username) || ""
  }

  set username(username : string){
    this.usernameBS.next(username)
    if(username) this.setSessionStorage(StorageKey.username, username)
  }

  get loginCheck (){
    const isLogin = sessionStorage.getItem(StorageKey.login)
    if(isLogin){
      const json : CheckLogin = JSON.parse(isLogin) as CheckLogin
      return json.isLogin
    }
    return false
  }

  set loginCheck(isLogin : boolean){
    const saveLogin : CheckLogin = {isLogin : isLogin}
    sessionStorage.setItem(StorageKey.login, JSON.stringify(saveLogin))
  }

  login(body : FormGroup) : Observable<any>{
    return this.http.post(`${this.dbUrl}/login`, body.value)
  }

  isAuthenticated(role : string) : boolean{
    return this.role === role && this.username !== ""
  }

  register(body : FormGroup) : Observable<any>{
    return this.http.post(`${this.dbUrl}/register`, body.value)
  }

  refreshAccessToken(refreshToken : string) : Observable<NewTokens>{
    return this.http.post<ApiResponse>(`${this.dbUrl}/api/auth/refresh`, refreshToken).pipe(
      map(resp => {
        return { newAccessToken : resp.message.accessToken, newRefreshToken : resp.message.refreshToken}
      }),
      catchError(err => {
        return throwError(() => new Error("errore nuovo yoken"))
      })
    )
  }

  logout() {
    const username = this.username
    this.http.post(`${this.dbUrl}/api/auth/logout`, username).subscribe({
      next : resp => {
        console.log("response", resp)
        this.role = ""
        this.username = ""
        sessionStorage.clear()
        this.router.navigate(["/login"])
      },
      error : err => {
        console.log("errore logout", err)
        return of(null)
      }}
    )
  }
}
