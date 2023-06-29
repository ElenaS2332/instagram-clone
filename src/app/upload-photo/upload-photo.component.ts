import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, NgForm, Validators } from '@angular/forms';
import { IPhoto } from '../photos/photo';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { ViewChildren } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  pageTitle : string = '';
  uploadPhotoForm! : FormGroup;
  uploadedPhoto !: IPhoto;
  
  sub !: Subscription;

  titleMessage : string = ''; 
  imageUrlMessage: string = '';
  thumbnailImageUrlMessage: string = '';
  private validationMessages : {[key:string] : string} = {
    required: 'Field is required'
  }

  constructor(private service: ApiService,
      private route: ActivatedRoute,
      private router: Router,
      private toastr: ToastrService,
      
      private fb: FormBuilder
     ){}

  
  ngOnInit(): void {
      this.uploadPhotoForm = this.fb.group({
        title: ['', [Validators.required]],
        url: ['', [Validators.required]],
        thumbnailUrl: ['', [Validators.required]]
      })

      const titleControl = this.uploadPhotoForm.get('title');
      titleControl?.valueChanges.pipe(
        debounceTime(1000)
      )
      .subscribe(
        value => this.setMessage(titleControl, 'title')
      )

      const imageUrlControl = this.uploadPhotoForm.get('inputImageUrl');
      imageUrlControl?.valueChanges.pipe(
        debounceTime(1000)
      )
      .subscribe(
        value => this.setMessage(imageUrlControl, 'imageUrl')
      )
      const thumbnailImageUrlControl = 
        this.uploadPhotoForm.get('inputThumbnailImageUrl');
        thumbnailImageUrlControl?.valueChanges.pipe(
          debounceTime(1000)
        )
        .subscribe(
        value => this.setMessage(thumbnailImageUrlControl, 'thumbnailImageUrl')
      )

      this.sub = this.route.paramMap.subscribe(
        params => {
          const id = Number(this.route.snapshot.paramMap.get('id'));
          this.getPhoto(id);
        }
      );

  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

  setMessage(c: AbstractControl, message: string){

    let updatedMessage = '';

    if((c.touched || c.dirty) && c.errors){
      updatedMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
      
    }

    switch(message) {
      case 'title' : this.titleMessage = updatedMessage; break;
      case 'imageUrl' : this.imageUrlMessage = updatedMessage; break;
      case 'thumbnailImageUrl' : this.thumbnailImageUrlMessage = updatedMessage; break;
    }


    
  }

  save(){
      // localStorage.setItem(this.uploadedPhoto.title, JSON.stringify(this.uploadedPhoto));
      // this.service.updateStorage(this.uploadedPhoto.title);
      // this.service.setLastIndex();
      if(this.uploadPhotoForm.valid){

        if(this.uploadPhotoForm.dirty){
          const p = { ...this.uploadedPhoto, ...this.uploadPhotoForm.value };

          if(p.id === 0){
            this.service.createPhoto(p)
            .subscribe({
              next: () => {
                this.onSaveComplete();
                console.log('In create a new photo')
              },
              error: err => this.errorMessage = err
            })
          }
          else{
            this.service.updatePhoto(p)
            .subscribe({
              next: () => 
                this.onSaveComplete(),
                error: err => this.errorMessage = err
            })
          }
        }else{
          this.onSaveComplete();
        }
      }else{
        this.errorMessage = 'Please fill in all fields.';
      }

  }

  onSaveComplete(){
    this.uploadPhotoForm.reset();
    this.router.navigate(['/photos']);
    this.toastr.success("Image successfully saved!");
  }

  //For Edit

  errorMessage : string = '';
  getPhoto(id: number) : void {
    this.service.getPhoto(id)
      .subscribe({
        next: (photo : IPhoto) => this.displayPhoto(photo),
        error: err => this.errorMessage = err
      })
  }

  displayPhoto(photo: IPhoto){
    if(this.uploadPhotoForm){
      this.uploadPhotoForm.reset();
    }
    this.uploadedPhoto = photo;

    if(this.uploadedPhoto.title === ''){
      this.pageTitle = 'Upload photo';
    }else{
      this.pageTitle = 'Edit photo'
    }

    this.uploadPhotoForm.patchValue({
      title: this.uploadedPhoto.title,
      inputImageUrl: this.uploadedPhoto.url,
      inputThumbnailImageUrl: this.uploadedPhoto.thumbnailUrl
    });

  }


  url : string = '';
  

  onSelect(event: any, name: string) {
    if (event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        if(name === 'thumbnail'){
          this.uploadedPhoto.thumbnailUrl = event.target.result;
          this.uploadPhotoForm.patchValue({
            thumbnailUrl: event.target.result // Update the form control name to "thumbnailUrl"
          });
        }else{
          this.uploadedPhoto.url = event.target.result;
          this.uploadPhotoForm.patchValue({
            url: event.target.result // Update the form control name to "thumbnailUrl"
          });
        }
        
      };
    }
  }


}
