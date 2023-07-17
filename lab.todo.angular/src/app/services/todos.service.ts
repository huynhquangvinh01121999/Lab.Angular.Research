import { Injectable } from '@angular/core';
import { Todo, TODOS } from './todo';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private apiUrl: string = 'https://jsonplaceholder.typicode.com/todos';

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getTodosFromApi(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(this.apiUrl)
      .pipe(
        tap(_ => console.log('fetched todos')),
        catchError(this.handleError<Todo[]>('getTodosFromApi', []))
      )
  }

  getTodoByIdFromApi(id: number): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(_ => console.log(`fetched todo id=${id}`)),
        catchError(this.handleError<Todo>('getTodoByIdFromApi'))
      )
  }

  // getTodos(): Todo[] {
  //   return TODOS
  // }

  getTodos(): Observable<Todo[]> {
    const todos = of(TODOS)
    return todos
  }

  getTodoById(id: number): Observable<Todo> {
    const todo = TODOS.find(h => h.id === id)!
    return of(todo)
  }
}
