import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { IPhoto } from './photo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit, OnDestroy {

  title = 'Photos'

  photos : IPhoto[] = [];
  errorMessage: string = '';
  sub !: Subscription;
  constructor(private service : ApiService, 
      private router: Router){}

  ngOnInit(): void {
    this.sub = this.service.getPhotos().subscribe({
      next: photos => this.photos = photos,
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
  
  showDetails(id : number | null) : void{
    this.router.navigate(['photos/' + id])
  }

  edit(id : number | null) : void {
    this.router.navigate(['photos/' + id + '/edit'])

  }

}
