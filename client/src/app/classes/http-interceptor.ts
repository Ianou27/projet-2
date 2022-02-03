// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { LoadingScreenService } from '@app/services/loading-screen/loading-screen.service';
// import { Observable } from 'rxjs';
// import { finalize } from 'rxjs/operators';

// @Injectable()
// export class LoadingScreenInterceptor implements HttpInterceptor {
//     activeRequests: number = 0;
//     /**
//      * URLs for which the loading screen should not be enabled
//      */
//     skippUrls = ['/authrefresh'];

//     constructor(private loadingScreenService: LoadingScreenService) {}

//     intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//         let displayLoadingScreen = true;
//         for (const skippUrl of this.skippUrls) {
//             if (new RegExp(skippUrl).test(request.url)) {
//                 displayLoadingScreen = false;
//                 break;
//             }
//         }
//         if (displayLoadingScreen) {
//             if (this.activeRequests === 0) {
//                 this.loadingScreenService.startLoading();
//             }
//             this.activeRequests++;
//             return next.handle(request).pipe(
//                 finalize(() => {
//                     this.activeRequests--;
//                     if (this.activeRequests === 0) {
//                         this.loadingScreenService.stopLoading();
//                     }
//                 }),
//             );
//         } else {
//             return next.handle(request);
//         }
//     }
// }
