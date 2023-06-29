import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  constructor(private router: Router,
    private service: ApiService){}
  redirectToPhotos(){
    this.router.navigate(['/photos'])
  }

  redirectToUploadPhoto(){
    this.router.navigate(['/photos/0/edit'])
  }

}
