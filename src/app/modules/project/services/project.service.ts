import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { Project } from '@app/models/Project';
import { LogService } from '@app/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient, private logService: LogService) { }

  getAll(): Observable<Project[]> {
    return this.httpClient.get<Project[]>('http://localhost:3000/projects')
      .pipe(
        tap((data) => this.logService.log(`getAll Eseguito ${data}`)),
        retry(3),
        catchError(this.handleError)
      );
  }

  add(project: Project): Observable<Project> {
    const projectToAdd = {
      ...project,
      code: Math.random().toString(36).replace('0', '').substring(2, 9),
      done: false,
      tasks: [],
    };
    return this.httpClient.post<Project>('http://localhost:3000/projects', projectToAdd)
      .pipe(
        tap((data) => this.logService.log(`add Eseguito ${data}`)),
        retry(3),
        catchError(this.handleError)
      );
  }

  get(id: number): Observable<Project> {
    return this.httpClient.get<Project>(`http://localhost:3000/projects/${id}`)
      .pipe(
        tap((data) => this.logService.log(`get Eseguito ${data}`)),
        retry(3),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

}


