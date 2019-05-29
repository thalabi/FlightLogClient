import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, empty } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MyMessageService } from "./message/mymessage.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private messageService: MyMessageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        console.log('HttpErrorInterceptor');
        console.log('request: %o', request);
        return next.handle(request).pipe(
            map((httpEvent: HttpEvent<any>) => {
                if (httpEvent instanceof HttpResponse) {
                    console.log('event--->>>', httpEvent);
                    // this.errorDialogService.openDialog(event);
                }
                return httpEvent;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                // let data = {};
                // data = {
                //     reason: error && error.error.reason ? error.error.reason : '',
                //     status: error.status
                // };
                // //this.errorDialogService.openDialog(data);
                console.error(httpErrorResponse);
                this.messageService.error('From HttpErrorInterceptor: '+httpErrorResponse.error.error, 'From HttpErrorInterceptor: '+JSON.stringify(httpErrorResponse.error));
                // if (httpErrorResponse.status !== 200) {

                // }
                return empty();
                //return throwError(httpErrorResponse);
            })
            );
        }
}