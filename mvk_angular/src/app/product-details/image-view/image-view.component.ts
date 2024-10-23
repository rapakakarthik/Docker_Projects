import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public images: Images,
    public dialogRef: MatDialogRef<ImageViewComponent>
  ) {
    console.log(images)
  }

  mainImg = this.images.original[0];

  changeImage(image: string) {
    this.mainImg = image;
    this.isScale = false;
  }

  isScale = false;

  close() {
    this.dialogRef.close();
  }



  // dupImages: string[] = [
  //   'https://m.media-amazon.com/images/I/81Os1SDWpcL._SL1500_.jpg',
  //   'https://m.media-amazon.com/images/I/81Os1SDWpcL._SL1500_.jpg',
  //   'https://m.media-amazon.com/images/I/71lmRVkniLL._SL1500_.jpg',
  //   'https://m.media-amazon.com/images/I/61lfdF60sRL._SL1500_.jpg'
  // ];

  currentIndex: number = 0;

  // Navigate to the previous image
  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.compress.length - 1; // Loop to the last image
    }
  }

  // Navigate to the next image
  nextImage(): void {
    if (this.currentIndex < this.images.compress.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to the first image
    }
  }

  // Select an image by clicking on the thumbnail
  selectImage(index: number): void {
    this.currentIndex = index;
  }
}
interface Images {
  length: number;
  original: string[],
  compress: string[],
  productName: string
}