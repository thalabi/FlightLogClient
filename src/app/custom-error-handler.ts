import { ErrorHandler, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MyMessageService } from './message/mymessage.service';


export class CustomErrorHandler implements ErrorHandler {

    constructor(@Inject(MyMessageService) private messageService: MyMessageService) {
    }

    handleError(error: any): void {
        this.showErrorInConsole(error);
        if (error instanceof HttpErrorResponse) {
            // let httpErrorResponse: HttpErrorResponse = error;
            // let summaryMessage: string = httpErrorResponse.name + ', HTTP Status Code: ' + httpErrorResponse.status + ', ' + httpErrorResponse.error.message;
            // let detailMessage: string = httpErrorResponse.error.message;
            // this.messageService.error(summaryMessage, detailMessage);
            let message: {summaryMessage: string, detailMessage: string} = CustomErrorHandler.getHttpErrorResponseMessages(error);
            this.messageService.error(message.summaryMessage, message.detailMessage);
        } else {
            if (error.message.startsWith('ExpressionChangedAfterItHasBeenCheckedError')) {
                return;
            }
            this.messageService.error(error.name, error.message);
        }

    }

    public static getHttpErrorResponseMessages(httpErrorResponse: HttpErrorResponse): {summaryMessage: string, detailMessage: string} {
        console.log('Begin ...');
        let summaryMessage: string = httpErrorResponse.name + ', HTTP Status Code: ' + httpErrorResponse.status;
        let detailMessage: string = JSON.stringify(httpErrorResponse.error);
        console.log('End ...');
        return {summaryMessage, detailMessage}
    }
    
    private showErrorInConsole(error: any) :void {
        if (console && console.group && console.error) {
            console.group("Error");
            console.error('error: ', error);
            console.error('error.name: ', error.name);
            console.error('error.message: ', error.message);
            console.error('error.stack: ', error.stack);
            console.error('error instanceof HttpErrorResponse: ', error instanceof HttpErrorResponse);
            if (error instanceof HttpErrorResponse) {
                let httpErrorResponse: HttpErrorResponse = error;
                if (httpErrorResponse.error) {
                    console.group("HttpErrorResponse");
                    console.error('httpErrorResponse.error.oracleSqlError: ', httpErrorResponse.error.oracleSqlError);
                    console.error('httpErrorResponse.error.oracleSqlMessage: ', httpErrorResponse.error.oracleSqlMessage);
                    console.error('httpErrorResponse.error.originalSqlStatement: ', httpErrorResponse.error.originalSqlStatement);
                    console.error('httpErrorResponse.error.sqlStatement: ', httpErrorResponse.error.sqlStatement);
                    console.error('httpErrorResponse.error.stackTrace: ', httpErrorResponse.error.stackTrace);
                    console.groupEnd();
                }
            }
            console.groupEnd();
        }
    }
}

