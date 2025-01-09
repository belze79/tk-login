import { Injectable } from '@angular/core';
import { StorageKey } from '../enums/http-key';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Language{
  [key : string]  : {
    [key : string] : string
  }
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly key : string = StorageKey.lang
  private readonly pathJson = 'assets/i18n/'
  private langSubject : BehaviorSubject<string> =  new BehaviorSubject<string>('it')
  private languageSubject : BehaviorSubject<Language> = new BehaviorSubject<Language>({})
  lang$ : Observable<string> = this.langSubject.asObservable()
  language$ : Observable<Language> = this.languageSubject.asObservable()

 
  constructor(private http : HttpClient, private authService : AuthService) {
    const langFromStorage = this.lang
    this.langSubject.next(langFromStorage)
    if(this.authService.loginCheck){
      this.language = langFromStorage
    }
  }

  set language(lang : string){
      this.http.get(`${this.pathJson}${lang}.json`)
      .subscribe({
        next : resp => {
          this.languageSubject.next(resp as Language)
          console.log("lingua corrente", this.languageSubject.value)
        },
        error : err => console.log('errore caricamento json', err)
      })
  }

  get lang() : string{
    return localStorage.getItem(this.key) || 'it'
  }

  set lang(lang : string){
    if(lang !== this.langSubject.value){
      this.langSubject.next(lang)
      localStorage.setItem(this.key, lang)
      this.language = lang
    }
  }

  
}
