import { Component } from '@angular/core';
import { DirectoryService } from './directory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  path: string;
  directoryListing: any[] = [];

  constructor(private directoryService: DirectoryService) {
    this.path = '';
  }

  getDirectoryListing(path: string) {
    this.directoryService.getDirectoryListing(path).subscribe(
      (listing) => {
        this.directoryListing = listing;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
