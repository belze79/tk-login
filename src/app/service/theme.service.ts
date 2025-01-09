import { Injectable } from '@angular/core';
import { RequestUrl, StorageKey } from '../enums/http-key';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

interface StorageTheme{
  isDark : boolean
}

interface ThemeRequest{
  token : string,
  dark : boolean
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly key : string = StorageKey.theme
  private themeSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  theme$ = this.themeSubject.asObservable()

  constructor(private authService : AuthService) {
    if(this.authService.loginCheck){
      this.toggleTheme(this.theme)
    }
  }

  get theme(){
    const theme = localStorage.getItem(this.key)
    if(theme){
      const json : StorageTheme = JSON.parse(theme) as StorageTheme
      return json.isDark
    }
    return false 
    // theme ? (JSON.parse(theme) as StorageTheme).value : false
  }
  
  set theme(isDark : boolean){
    if(isDark !== this.themeSubject.value){
      const saveTheme : StorageTheme = {isDark : isDark}
      localStorage.setItem(this.key, JSON.stringify(saveTheme))
      this.toggleTheme(isDark)
    }
  }
  
  private toggleTheme(isDark : boolean){
    if(isDark !== this.themeSubject.value){
      this.themeSubject.next(isDark)
      document.body.classList.toggle("dark", isDark)
    }
  }
}
