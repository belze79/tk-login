import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Player, TravelService } from '../../service/travel.service';
import { ThemeService } from '../../service/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-phalangiate',
  templateUrl: './phalangiate.component.html',
  styleUrls: ['../../../assets/css/server.css', './phalangiate.component.css']
})
export class PhalangiateComponent implements OnInit, OnDestroy{

  subscriptions : Subscription = new Subscription()
  isDark! : boolean
  serverVel : number[] = [1, 1.5, 2, 2.666666, 3]
  serverName : string[] = ['X1', 'X2', 'X3', 'Mm', 'X5']
  serverSelected : number = 0
  serverSpeed : number = 1
  modals : {[key : string] : boolean} = {}

  constructor(private themeService : ThemeService, private travelService : TravelService){}


  ngOnInit(): void {
    this.subscriptions.add(
      this.themeService.theme$.subscribe(isDark => this.isDark = isDark)
    )
  }
  
  ngOnDestroy(): void {
      this.subscriptions.unsubscribe()
  }

  prova(){
    const p1 : Player = {nick : '', villa : '', x : -63, y : -36}
    const p2 : Player = {nick : '', villa : '', x : 63, y : 36}
    const distance = this.travelService.getDistance(p1, p2)
    const travel = this.travelService.getTravelTime(distance, 19, 4, 2, false)
    const stringTime = this.travelService.timeString(travel)
    const start = this.travelService.startTime(new Date(2000, 0, 1, 23), travel)
    console.log(`distance: ${distance}\ntravel : ${travel}\ntime: ${stringTime}\nstart: ${start.toLocaleString()}`)
  }

  setServer(direction : number) : void{
    if(direction > 0){
      this.serverSelected = ++this.serverSelected > 4 ? 0 : this.serverSelected
    }
    else this.serverSelected = --this.serverSelected < 0 ? 4 : this.serverSelected
    this.serverSpeed = this.serverVel[this.serverSelected]
  }

  handleModal(modal : string){
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

  stopPropagation(e : Event){
    e.stopPropagation()
  }

  // @HostListener('document:click', ['$event'])
  // closeModal(e : MouseEvent){
  //   const target = e.target as HTMLElement
  //   if(!target.closest('.btn')){
  //     this.closeModals()
  //   }
  // }

}
