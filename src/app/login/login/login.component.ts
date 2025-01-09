import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../service/language.service';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../assets/css/login.css', './login.component.css']
})
export class LoginComponent implements OnInit{

  formLogin! : FormGroup
  errorUsername : boolean = false
  errorPsw : boolean = false
  spinner : boolean = false

  constructor(private fb : FormBuilder,
     private authService : AuthService,
     private languageService : LanguageService, 
     private themeService : ThemeService,
     private router : Router){}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      username : [null, Validators.required],
      psw : [null, Validators.required]
    })
  }

  submit(){
    this.spinner = true
    if(this.formLogin.valid){
      this.authService.login(this.formLogin).subscribe({
        next : (response) => {
          const {accessToken, refreshToken, role, username, lang, dark} = response.message
          this.authService.loginCheck = true
          this.authService.role = role
          this.authService.username = username
          this.authService.accessToken = accessToken
          this.authService.refreshToken = refreshToken
          this.languageService.lang = lang
          this.languageService.language = lang
          this.themeService.theme = dark
          let route = "/" + (role as string).toLowerCase()
          if(!["/admin", "/user"].includes(route)){
            route = ""
          }
          if(route === "/user") route = "/home"
          this.spinner = false
          this.router.navigate([route])
        },
        error : (error) => {
          let err = error.error.message
          this.errorUsername = err === "INVALID_USERNAME"
          this.errorPsw = err === "INVALID_PSW"
          this.spinner = false
        }
      })
    }
  }

}
