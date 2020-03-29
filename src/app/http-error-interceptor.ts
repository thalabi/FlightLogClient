import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
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
                console.error('httpErrorResponse: %o', httpErrorResponse);
                let errorMessage: string;
                if (httpErrorResponse.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = httpErrorResponse.error.message;
                    console.error('Client error: [%s]', errorMessage);
                } else {
                    // server-side error
                    if (httpErrorResponse.status === 0) { // status = 0, is net::ERR_CONNECTION_REFUSED
                        errorMessage = 'Error status code: ' + httpErrorResponse.status + ', message: Connection problem';
                    } else {
                        errorMessage = 'Error status code: ' + httpErrorResponse.status + ', message: ' + httpErrorResponse.error.error;
                    }
                    console.error('Server error', errorMessage);
                }
                this.messageService.error(errorMessage);
                return throwError(httpErrorResponse);
            })
        );
    }
}