import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestUrl } from '../enums/http-key';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly dbUrl : string = RequestUrl.testDbUrl //RequestUrl.dbUrl
  private readonly accessTokenStorageKey = "accessToken"
  private readonly refreshTokenStorageKey = "refreshToken"

  constructor(private http : HttpClient) { }

  setHeader(storageKey : string) : HttpHeaders{
    const token : string = sessionStorage.getItem(storageKey) || ""
    return new HttpHeaders({
      Authorization : `Bearer ${token}`
    })
  }

  getAllUsers() : Observable<any>{
    const headers = this.setHeader(this.accessTokenStorageKey)
    return this.http.get(`${this.dbUrl}/api/admin`, {headers})
  }

  getUserById(id : number) : Observable<any>{
    const headers = this.setHeader(this.accessTokenStorageKey)
    return this.http.get(`${this.dbUrl}/api/admin/${id}`, {headers})
  }
}
