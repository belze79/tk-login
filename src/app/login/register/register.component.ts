import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../../assets/css/login.css', './register.component.css']
})
export class RegisterComponent implements OnInit{

  formRegister! : FormGroup
  errorUsernameExists : boolean = false
  errorEmailInvalid : boolean = false
  errorEmailExists : boolean = false
  errorPswShort : boolean = false
  spinner : boolean = false

  constructor(private fb : FormBuilder, private authSercice : AuthService, private router : Router){}

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      username : [null, Validators.required],
      email : [null, Validators.required],
      psw : [null, Validators.required]
    })
  }

  submit() : void{
    if(this.formRegister.valid){
      this.spinner = true
      this.authSercice.register(this.formRegister).subscribe({
        next : (resp) => {
          this.spinner = false
          this.router.navigate(["/login"])
        },
        error : (error) => {
          let errors = error.error.message
          this.errorEmailInvalid = false
          this.errorPswShort = false
          this.errorEmailExists = false
          this.errorUsernameExists = false
          if(Array.isArray(errors)){
            this.errorEmailInvalid = errors.includes("INVALID_EMAIL")
            this.errorPswShort = errors.includes("SHORT_PSW")
          }
          if(typeof errors === "string"){
            this.errorEmailExists = errors === "EXISTS_EMAIL"
            this.errorUsernameExists = errors === "EXISTS_USERNAME"
          }
          this.spinner = false
        }
      })
    }
  }

}
