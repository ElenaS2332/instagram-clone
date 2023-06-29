import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPhoto } from './photo';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnInit, OnDestroy {
  title = 'Photo Details'
  photo !: IPhoto;

  errorMessage : string = '';
  sub !: Subscription ;

  constructor(private activeRoute: ActivatedRoute, 
    private router: Router,
    private service: ApiService){}

  ngOnInit(): void {
    const param = this.activeRoute.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getPhoto(id);
    }
  }
  getPhoto(id: number): void {
    this.sub = this.service.getPhoto(id).subscribe({
      next: photo => this.photo = photo,
      error: err => this.errorMessage = err
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  deletePhoto(){
    if(this.photo.id === 0){
      this.router.navigate(['/photos']);
    }else{
      if( confirm('Are you sure you want to delete this photo?')){
        this.service.delete(this.photo.id)
        .subscribe({
          next: () => {
            console.log('Deleted');
            this.router.navigate(['/photos']);
          },
          error: err => this.errorMessage = err
        })
      }
    }
  }

  edit(){
    this.router.navigate(['photos/' + this.photo.id + '/edit']);

  }

}
