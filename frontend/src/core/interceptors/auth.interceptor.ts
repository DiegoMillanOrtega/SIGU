import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const clonedRequest = req.clone({
        withCredentials: true,
    });

    return next(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn(error.message);
                
                router.navigate(['/auth/login']);
            }
            return throwError(error);
        })
    );
};