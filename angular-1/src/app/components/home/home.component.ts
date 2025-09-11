import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { SimpleTestEntity } from '../../../dto/simple-test-entity.interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  callApi1() {
    this.http.get('http://hackaton.fun:9091/java-1/get1', { responseType: 'text' }).subscribe({
      next: data => console.log('Response from API 1:', data),
      error: error => console.error('Error from API 1:', error)
    });
  }

  callApi2(id: number) {
    this.http.get<SimpleTestEntity>(`http://hackaton.fun:9091/java-1/get2?id=${id}`).subscribe({
      next: data => console.log('Response from API 2:', data),
      error: error => console.error('Error from API 2:', error)
    });
  }

  // callApi2() {
  //   this.http.get('http://localhost/java-1/get2', { responseType: 'text' }).subscribe({
  //     next: data => console.log('Response from API 2:', data),
  //     error: error => console.error('Error from API 2:', error)
  //   });
  // }

  callApi3() {
    this.http.get('http://localhost/java-1/get3', { responseType: 'text' }).subscribe({
      next: data => console.log('Response from API 3:', data),
      error: error => console.error('Error from API 3:', error)
    });
  }

  protected readonly Number = Number;

  navigateToGoogleMapComponent() {
    this.router.navigate(['/google-map']);
  }
}
