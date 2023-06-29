import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map, of, tap, throwError } from 'rxjs';
import { IPhoto } from '../photos/photo';


@Injectable({
  providedIn: 'root'
})export class ApiService {
  constructor(private http: HttpClient) { }

  private photosUrl = 'api/photos';

  // If you want to receive the data directly from the API 
  // However, there are circular dependencies detected because of Photo-data
  // Hardcoding the values seemed like the better option for now
  // private photosUrl = 'https://jsonplaceholder.typicode.com/photos';

  photos : IPhoto[] = [];
  sub!: Subscription;
  isSubscribed : boolean = false;
  errorMessage : string = '';

  getPhotos(): Observable<IPhoto[]> {
    return this.http.get<IPhoto[]>(this.photosUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );

    
  }

  getPhoto(id : number): Observable<IPhoto>{
    if(id === 0){
      return of(this.initializePhoto())
    }

    const url = `${this.photosUrl}/${id}`;

    return this.http.get<IPhoto>(url)
      .pipe(
        tap(data => console.log('get product: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
        if(err.error instanceof ErrorEvent){
            errorMessage = `An error occured: ${err.error.message}`
        }
        else{
            errorMessage = `Server returned code: ${err.status},
                error message is: ${err.message}`;
        }

        console.error(errorMessage);
        return throwError(() => errorMessage);
  }
  
  initializePhoto() : IPhoto {
    return {
      albumId : 1,
      id : 0,
      title : '',
      url : '',
      thumbnailUrl : ''
    }
  }

  //CREATE
  createPhoto(photo: IPhoto): Observable<IPhoto>{
    const headers = new HttpHeaders({'Content-type' : 'application/json'});
    photo.id = null;
    return this.http.post<IPhoto>(this.photosUrl, photo, { headers })
      .pipe(
        tap(data => console.log('CreatePhoto: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  //EDIT
  updatePhoto(photo : IPhoto): Observable<IPhoto>{
    const headers = new HttpHeaders({'Content-type' : 'application/json'});
    const url = `${this.photosUrl}/${photo.id}`;
    return this.http.put<IPhoto>(url, photo, { headers: headers})
      .pipe(
        tap(() => console.log('UpdatePhoto: '+ photo.id)),
        map(() => photo),
        catchError(this.handleError)
      );
  }


  //DELETE
  delete(id: number | null | undefined) : Observable<IPhoto>{
    const headers = new HttpHeaders({'Content-type' : 'application/json'});
    const url = `${this.photosUrl}/${id}`;
    return this.http.delete<IPhoto>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deletePhoto' + id)),
        catchError(this.handleError)
      );
  }



}
