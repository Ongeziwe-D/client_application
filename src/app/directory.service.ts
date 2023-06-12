import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DirectoryService {
  private apiUrl = 'http://localhost:3000/api/directory';

  constructor(private http: HttpClient) {}

  getDirectoryListing(path: string) {
    const params = { path };
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
