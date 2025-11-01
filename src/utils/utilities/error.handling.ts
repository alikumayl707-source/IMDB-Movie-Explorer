import { HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  defer,
  Observable,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import { logger } from './logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/** handle error taking the error object as parameter from the http request observable that will pass on the requestWrapper function as parameter*/
export const handleError = (error: HttpErrorResponse): Observable<never> => {
  /**hold the error status and the error message */
  let errorResponseMessage = `Server Error: ${error.status} - ${error.message}`;
  /**Check the instance of the error event in order to check clint side or server side */
  if (error.error instanceof ErrorEvent) {
    /**for client side error */
    errorResponseMessage = `Client Side Error : ${error.error.message}`;
  } else {
    /**for server side error */
    errorResponseMessage = getServerErrorMessage(error.status, error.message);
  }

  logger(errorResponseMessage);
  //** Return the throwError observable*/
  return throwError(() => new Error(errorResponseMessage));
};

/**Request Wrapper Function is a generic type of generic function to dealing with http reponse error handling and return the observable*/
export const requestWrappers = <T>(
  observable: Observable<T>
): Observable<T> => {
  /** Defer is a rxjs operator that will again create the observale when requestWrapper function will be emit by subscribe*/
  return defer(() => {
    /**Initialize retry attempt = 0 */
    let retryAttempt = 0;
    /**create a custom function that will also returns the Observable inisde defer observable*/
    const execute = (): Observable<T> => {
       /**Handling the errors of the http request that is passing in the parameter of request wrapper function*/ 
      return observable.pipe(
        /** this operator will handle an error in an observable of the http request that will pass on the parameter of request wrapper fn and will return the new observable */
        catchError((error: HttpErrorResponse) => {
          /** storing staus codes by the error of http statuses code in order to confirm isRetryable */
          const isRetryable = error.status == 503 || error.status == 0;
          /**Check if isRetryable is and retryAttempt is lesser than maximum retries which is 3 */  
          if (isRetryable && retryAttempt++ < MAX_RETRIES) {
          /** if condition is true, then it will start the timer delay of per second until retryAttempt till reach the 3 attempts and retruns the observable in each second of retry's*/
            return timer(RETRY_DELAY_MS * retryAttempt).pipe(
          /**Inside the new observable will use switch map to canceling previous obsverable emission and calling exceute function again */    
              switchMap(() => execute())
            );
          }
          /** this will handle the error by passing error object of that observable that was pass in the requestWrapper function and tells either it comes from frontend or backend */
          return handleError(error);
        })
      );
    };
    /** will again call and return the execute function to that observable that is created by defer operator*/
    return execute();
  });
};

const getServerErrorMessage = (status: number, message: string): string => {
  const errorMessages: Record<number, string> = {
    400: 'Bad Request – Invalid input.',
    401: 'Unauthorized – Please log in.',
    403: "Forbidden – You don't have permission.",
    404: 'EndPoint Not Found – Resource unavailable.',
    500: 'Internal Server Error – Please try again later.',
  };
  return errorMessages[status] || `Unexpected Error: ${status} - ${message}`;
};
