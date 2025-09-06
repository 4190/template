import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App {

  private http = inject(HttpClient);

  constructor() {}

  callApi1() {
    this.http.get('http://localhost/java-1/get1', { responseType: 'text' }).subscribe({
      next: data  => console.log('Response from API 1:', data),
      error: error => console.error('Error from API 1:', error)
    });
  }

  callApi2() {
    this.http.get('http://localhost/java-1/get2', { responseType: 'text' }).subscribe({
      next: data => console.log('Response from API 2:', data),
      error: error => console.error('Error from API 2:', error)
    });
  }

  callApi3() {
    this.http.get('http://localhost/java-1/get3', { responseType: 'text' }).subscribe({
      next: data => console.log('Response from API 3:', data),
      error: error => console.error('Error from API 3:', error)
    });
  }
}
