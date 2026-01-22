import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from '@/interface/auth.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

    public currentUser = signal<any>(null);
    private userId = signal<string | null>(localStorage.getItem('user_id'));
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/auth';

    setUserId(userId: string) {
        this.userId.set(userId);
        localStorage.setItem('user_id', userId);
    }

    getUserId(): string | null {
        return this.userId();
    }

    login(email: string, password: string){
        return this.http.post(`${this.baseUrl}/login`, {
            email: email,
            password: password
        })
    }

    checkAuthStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}/me`).pipe(
            tap(user => {
                const authResponse = user as AuthResponse;
                this.setUserId(authResponse.userId);
                this.currentUser.set(authResponse);
            }),
            catchError(err => {
                this.currentUser.set(null);
                return throwError(() => err);
            })
        );
    }
    
}