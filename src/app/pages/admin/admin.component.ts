import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

interface User{
  idUser : number,
  username : string,
  email : string,
  psw : string
  ruolo : string,
  refreshToken : string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  username : string | null = this.authService.username
  userCount : number = 5
  spinner : boolean = false
  users : User[] = []
  displayedUsers : User[] = []
  arrayPages : number[] = []
  showButtonArray : number[] = []
  currentPage : number = 1
  rowsPerPage : number = 1
  totalRecords : number = 0
  totalPages : number = 0
  showUsers : boolean = false

  constructor(private authService : AuthService, 
    private adminService : AdminService,
    private router : Router){}

  ngOnInit(): void {
    this.spinner = true
    this.adminService.getAllUsers().subscribe({
      next : (resp : {message : User[], success : boolean}) => {
        console.log("api responsedal backend",resp)
        this.users = resp.message.sort((a, b) => a.idUser - b.idUser)
        this.totalRecords = resp.message.length
        this.totalPages = Math.ceil(resp.message.length / this.rowsPerPage)
        this.setDisplayedUsers()
        this.arrayPages = Array(this.totalPages).fill(0).map((el, i) => i + 1)
        this.showButtonArray = this.arrayPages.slice(0, 5)
        this.spinner = false
      },
      error : (err) => {
        console.log("errore reperimento dati", err)
      }
    })
  }

  prevPage(){
    if(this.currentPage - 1 >= 1){
      this.currentPage--
      this.setDisplayedUsers()
      this.setShowButtonArray()
    }
  }

  nextPage(){
    if(this.currentPage + 1 <= this.totalPages){
      this.currentPage++
      this.setDisplayedUsers()
      this.setShowButtonArray()
    }
  }

  goToPage(page : number) : void{
    this.currentPage = page
    this.setDisplayedUsers()
    this.setShowButtonArray()
  }

  setShowButtonArray(){
    if(this.currentPage > 3 && this.currentPage < this.totalPages - 1){
      const startIndex = this.currentPage - 3
      const endIndex = startIndex + 5
      this.showButtonArray = this.arrayPages.slice(startIndex, endIndex)
    }
    else this.showButtonArray = this.arrayPages.slice(0, 5)
  }

  getAllUsers(){
    this.showUsers = true
  }

  setDisplayedUsers(){
    const startIndex = (this.currentPage - 1) * this.rowsPerPage
    const endIndex = startIndex + this.rowsPerPage
    this.displayedUsers = this.users.slice(startIndex, endIndex)
  }

  getUserById(){
    this.spinner = true
    // const userId = Math.floor(Math.random() * this.userCount) + 1
    this.adminService.getUserById(this.userCount).subscribe({
      next : (resp) => {
        console.log("user trovato", resp)
        this.spinner = false
      },
      error : (err) => {
        console.log(err)
        this.spinner = false
      }
    })
  }

  logout(){
    this.authService.logout()
  }

}
