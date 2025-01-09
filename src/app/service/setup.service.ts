import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestUrl } from '../enums/http-key';
import { AuthService } from './auth.service';

interface SetupUserDto{
  token : string,
  lang? : string,
dark? : boolean
}



@Injectable({
  providedIn: 'root'
})
export class SetupService {

  private readonly dbUrl : string = RequestUrl.testDbUrl //RequestUrl.dbUrl
  private readonly endpoint : string = "/api/set"

  constructor(private http : HttpClient, private authervice : AuthService) { }

  getAllSetup(){
    this.http.get(`${this.dbUrl}${this.endpoint}`).subscribe({
      next : resp => console.log("risposta ok tutti setup", resp),
      error : err => console.log("errore richiesta setup", err)
    })
  }

  getSetupById(id : number){
    this.http.post(`${this.dbUrl}${this.endpoint}/${id}`, this.authervice.accessToken).subscribe({
      next : resp => console.log("risposta st by id", resp),
      error : err => console.log("vacca madonna impestata", err)
    })
  }

  setLang(body : SetupUserDto){
    this.http.post<SetupUserDto>(`${this.dbUrl}${this.endpoint}/lang`, body).subscribe({
      next : resp => console.log("risposta da /api/set/lang", resp),
      error : err => console.log("errore aggiornamento lingua", err)
    })
  }

  setTheme(body : SetupUserDto){
    this.http.post<SetupUserDto>(`${this.dbUrl}${this.endpoint}/theme`, body).subscribe({
      next : resp => console.log("risposta da /api/set/theme", resp),
      error : err => console.log("errore aggiornamento tema", err)
    })
  }
}
