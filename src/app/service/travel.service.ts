import { Injectable } from '@angular/core';

export interface Player{
  nick : string,
  villa : string,
  x : number,
  y : number
}


@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor() { }

  getDistance(p1 : Player, p2 : Player) : number{
    const x1 : number = p1.x
    const x2 : number = p1.y
    const y1 : number = p2.x
    const y2 : number = p2.y
    return Math.sqrt(Math.pow(y2 - x2, 2) + Math.pow(y1 - x1, 2))
  }

  getTravelTime(distance : number, speedTroop : number, ts : number, speedServer : number, isSiege : boolean) : number{
    const normalSpeed = speedTroop * speedServer
    const tsSpeed = ts !== 0 ? normalSpeed + normalSpeed * (ts / 10) : normalSpeed
    let travel = 0
    if(distance > 20){
      const difference = distance - 20
      const time20 = 20 * 3600 / normalSpeed
      const timeTs = difference * 3600 / tsSpeed
      travel = time20 + timeTs
    }
    else travel = distance * 3600 / normalSpeed
    return isSiege ? Math.floor(travel * 2) : Math.floor(travel)
  }

  startTime(arrival : Date, travel : number) : Date{
    return new Date(arrival.getTime() - travel * 1000)
  }

  timeString(travel : number) : string{
    const h : string = Math.floor(travel / 3600).toString()
    const m : string = Math.floor(travel % 3600 / 60).toString()
    const s : string = Math.floor(travel % 60).toString()
    return `${h.padStart(2, '0')} : ${m.padStart(2,'0')} : ${s.padStart(2, '0')}`
  }
}
