import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhotosComponent } from './photos.component';
import { PhotoDetailsComponent } from './photo-details.component';
import { SharedModule } from '../shared/shared.module';
import { UploadPhotoComponent } from '../upload-photo/upload-photo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { PhotosData } from './photos-data';



@NgModule({
  declarations: [
    PhotosComponent,
    PhotoDetailsComponent,
    UploadPhotoComponent,
  ],
  imports: [
    RouterModule.forChild([
      { path: 'photos', component: PhotosComponent },
      { path: 'photos/:id', component: PhotoDetailsComponent},
      { path: 'photos/0/edit', component: UploadPhotoComponent },
      { path: 'photos/:id/edit', component: UploadPhotoComponent},
    ]),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    InMemoryWebApiModule.forRoot(PhotosData),

  ]
})
export class PhotosModule { }
