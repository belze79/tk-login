import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, finalize, Observable, repeat, switchMap, throwError } from "rxjs";
import { AuthService, NewTokens } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    private tokenRequest : string | null = null
    private isRequest = false

    constructor(private authService : AuthService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // escludo le rotte che non richiedono autorizzazioni
        if(["assets", "login", "register"].some(word => request.url.includes(word))){
            return next.handle(request)
        }

        const accessToken = this.tokenRequest ? this.tokenRequest : this.authService.accessToken
        console.log(!this.tokenRequest ? "access token" : "new access token")

        // Aggiungiamo l'header Authorization solo se abbiamo un token
        const authRequest = accessToken ? request.clone({
            setHeaders : {Authorization : `Bearer ${accessToken}`}
        }) : request
        
        // Passiamo la richiesta clonata al prossimo handler
        return next.handle(authRequest).pipe(
            catchError((error : HttpErrorResponse) => {
                if(error.status === 401 || error.status === 403){
                    console.log("errore intercettato", error.status)
                    return this.handle401Error(request, next)
                }
                return throwError(() => error)
            })
        )
    }

    private handle401Error(request : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>>{
        console.log("ingresso nel metodo handle401Error")
        if(this.isRequest){
            console.log("richiesta in corso")
            return next.handle(request)
        }
        this.isRequest = true
        this.tokenRequest = this.authService.refreshToken
        if(!this.tokenRequest){
            this.authService.logout()
            return throwError(() => new Error("refreshtoken non presente in session storage"))
        }
        const refreshRequest = request.clone({setHeaders : {uthorization : `Bearer ${this.tokenRequest}`}})
        console.log("richiesta aggiornata col refresh token", refreshRequest)
        return this.authService.refreshAccessToken(this.authService.refreshToken).pipe(
            switchMap((tokens : NewTokens) => {
                this.authService.accessToken = tokens.newAccessToken
                this.authService.refreshToken = tokens.newRefreshToken
                console.log("new accessToken", tokens.newAccessToken)
                console.log("new refreshToken", tokens.newRefreshToken)
                const newAuthRequest = request.clone({setHeaders : {Authorization : `Bearer ${tokens.newAccessToken}`}})
                console.log("invio nuova richiesta", newAuthRequest)
                return next.handle(newAuthRequest)
            }),
            catchError(refreshError => {
                if([401, 403].includes(refreshError.status)){
                    console.log("errore token, rimanda al login")
                    this.authService.logout()
                    return throwError(() => new Error("Errore autorizzazione", refreshError))
                }
                return throwError(() => new Error("errore generico", refreshError))
            }),
            finalize(() => {
                this.isRequest = false
                this.tokenRequest = null
            })
        )
    }
    
}