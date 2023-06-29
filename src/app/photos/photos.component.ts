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

  page: number = 1;
  count : number = 0;
  tableSize : number = 5;
  tableSizes: any = [5, 10, 15, 20]



  constructor(private service : ApiService, 
      private router: Router){}

  ngOnInit(): void {
    this.postList();
  }

  postList(){
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

  
  onTableDataChange(event : any){
    this.page = event;
    this.postList();
  }

  onTableSizeChange(event : any){
    this.tableSize = event.target.value;
    this.page = 1;
    this.postList();
  }



}
