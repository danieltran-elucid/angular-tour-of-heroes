import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessageService } from './message.service';


// @Injectable() decorator. This marks the class as one that participates in the dependency injection system.
//  @Injectable() decorator accepts a metadata object for the service
@Injectable({
  providedIn: 'root'
  // You must make the HeroService available to the dependency injection system before Angular can inject it into the HeroesComponent by registering a provider. A provider is something that can create or deliver a service; in this case, it instantiates the HeroService class to provide the service.
  // By default, the Angular CLI command ng generate service registers a provider with the root injector for your service by including provider metadata, that is providedIn: 'root' in the @Injectable() decorator.
  // When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects into any class that asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an application by removing the service if it turns out not to be used after all.
})

export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  // special header in HTTP save requests.
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  // declares a private messageService property. Angular will inject the singleton MessageService into that property when it creates the HeroService.
  // This is a typical "service-in-service" scenario: You inject the MessageService into the HeroService which is injected into the HeroesComponent.
  constructor(private http: HttpClient, private messageService: MessageService) { }

  
  /** GET heroes from the server */
// All HttpClient methods return an RxJS Observable of something.
// HTTP is a request/response protocol. You make a request, it returns a single response.
// In general, an observable can return multiple values over time. An observable from HttpClient always emits a single value and then completes, never to emit again.
// This particular HttpClient.get() call returns an Observable<Hero[]>; that is, "an observable of hero arrays". In practice, it will only return a single hero array.
  getHeroes(): Observable<Hero[]> {
    // HttpClient.get() returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, <Hero[]> , adds TypeScript capabilities, which reduce errors during compile time.
    // The server's data API determines the shape of the JSON data. The Tour of Heroes data API returns the hero data as an array.
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        // tap() operator, which looks at the observable values, does something with those values, and passes them along. The tap() call back doesn't touch the values themselves.
        // tap into the flow of observable values and send a message, using the log() method, to the message area at the bottom of the page.
        tap(_ => this.log('fetched heroes')), 
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  // Like getHeroes(), getHero() has an asynchronous signature. It returns a mock hero as an Observable, using the RxJS of() function.
  /** GET hero by id. Will 404 if id not found */
  // getHero() constructs a request URL with the desired hero's id
  // The server should respond with a single hero rather than an array of heroes
  // getHero() returns an Observable<Hero> ("an observable of Hero objects") rather than an observable of hero arrays
  getHero(id: number): Observable<Hero> {
    // Most web APIs support a get by id request in the form :baseURL/:id.
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      // The catchError() operator intercepts an Observable that failed. The operator then passes the error to the error handling function.
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
    // It expects the server to generate an id for the new hero, which it returns in the Observable<Hero> to the caller
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: update the hero on the server */
    // The HttpClient.put() method takes three parameters:
      // The URL
      // The data to update (the modified hero in this case)
      // Options
    // The URL is unchanged. The heroes web API knows which hero to update by looking at the hero's id
    // The heroes web API expects a special header in HTTP save requests. That header is in the httpOptions constant defined in the HeroService
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }



  //   /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  *
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  // The following handleError() method reports the error and then returns an innocuous result so that the application keeps working.
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
