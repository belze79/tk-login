import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ApiTravianService } from '../../service/api-travian.service';
import { map, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { SetupService } from '../../service/setup.service';
import { ThemeService } from '../../service/theme.service';
import { Language, LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  username! : string
  isHome! : boolean
  isOpenModal : boolean = false
  isDark : boolean = false
  language! : Language
  lang! : string
  modals : {[key : string] : boolean} = {}
  private subscriptions : Subscription = new Subscription()

  constructor(private authService: AuthService,
    private tkApiService: ApiTravianService,
    private setupService : SetupService,
    private themeService : ThemeService,
    private languageService : LanguageService,
    private router: Router) { }

  ngOnInit(): void {
    this.username = this.authService.username
    this.isHome = this.router.url === '/home'
    this.subscriptions.add(
      this.themeService.theme$.subscribe(isDark => this.isDark = isDark)
    )
    this.subscriptions.add(
      this.languageService.language$.subscribe(language => this.language = language)
    )
    this.subscriptions.add(
      this.languageService.lang$.subscribe(lang => this.lang = lang)
    )
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if(event instanceof NavigationEnd){
          this.isHome = this.router.url === '/home'
        }
      })
    )
    this.modals['theme'] = false
    this.modals['lang'] = false

    // this.tkApiService.getApiKey().subscribe({
    //   next: resp => {
    //     console.log(resp)
    //     const strToJson = JSON.parse(resp.message)
    //     console.log(strToJson)
    //   },
    //   error: err => console.error("errore api key", err)
    // })
  }
  ngOnDestroy(): void {
      this.subscriptions.unsubscribe()
  }

  openModal(modal : string){
    if(this.modals[modal] === true){
      this.modals[modal] = false
      return
    }
    this.closeModals()
    this.modals[modal] = true
  }

  private closeModals(){
    Object.keys(this.modals).forEach(key => {
      if(this.modals[key] === true){
        this.modals[key] = false
      }
    })
  }

  setTheme(isDark : boolean){
    if(this.themeService.theme === isDark) return
    this.themeService.theme = isDark
    this.setupService.setTheme({token : this.authService.accessToken, dark : isDark})
  }

  setLang(lang : string){
    if(this.languageService.lang === lang) return
    this.languageService.lang = lang
    this.setupService.setLang({token : this.authService.accessToken, lang : lang})
  }

 

  logout() {
    this.authService.logout()
  }

  stopPropagation(e : Event){
    e.stopPropagation()
  }

  @HostListener("document:click", ["$event"])
  closeModal(e : MouseEvent){
    const target = e.target as HTMLElement
    if(!target.closest('.btnHead') && !target.closest('modal')){
      this.closeModals()
    }
  }

}
