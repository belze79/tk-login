import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestUrl } from '../enums/http-key';


@Injectable({
  providedIn: 'root'
})
export class ApiTravianService {

  private readonly dbUrl = RequestUrl.testDbUrl //RequestUrl.dbUrl
  private readonly tkUrl : string = "https://it1n.kingdoms.com"

  constructor(private http : HttpClient) { }


  getApiKey() : Observable<any>{
    return this.http.post(`${this.dbUrl}/travian`, this.tkUrl)
  }
}
