import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { RfqService } from '../../services/rfq.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss'
})
export class WebcamComponent {
  
  @Input('loader') loader : boolean = false;
  
  private auth = inject(AuthenticationService);
  constructor(
    private rfq: RfqService,
    public dialogRef: MatDialogRef<WebcamComponent>,
  ) {
    
  }
  
  public webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  captureImg = true;

  public triggerSnapshot(): void {
    this.trigger.next();
    this.captureImg = false;
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public uploadImage(): void {
    if (this.webcamImage) {
      const file = this.dataURLtoFile(this.webcamImage.imageAsDataUrl, 'captured-image.png');
      const formData = new FormData();
      formData.append('avatar', file);
      // Call your API to upload the image here
      // console.log('FormData:', formData);
      this.rfq.updateUserPic(formData).subscribe({
        next: (value: any) => {
          if (value.status === 200) {
            this.dialogRef.close();
            this.auth.setProfilePic(value.fileUrl);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err.message, err.error);
        }
      })
    }
  }

  reuploadImage(){
    this.captureImg = true;
  }

  private dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'; // Default MIME type
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  errorMsg: string = ''
  handleError(error: WebcamInitError): void {
    this.errorMsg = error.message
    console.error('Error initializing webcam:', error);
  }
}
