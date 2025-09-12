import {Component, importProvidersFrom, inject, signal} from '@angular/core';
import {Router, RouterModule, RouterOutlet, NavigationEnd} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {routes} from './app.routes';
import {filter} from 'rxjs/operators';

@Component({
  imports: [RouterOutlet, RouterModule, CommonModule],
  providers: [],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {

  private http = inject(HttpClient);
  private router = inject(Router);
  private currentRoute = '';

  constructor() {
    // Track current route to hide navigation on google-map page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }

  isGoogleMapRoute(): boolean {
    return this.currentRoute === '/google-map';
  }

  callApi1() {
    this.http.get('http://hackaton.fun:9091/java-1/get1', { responseType: 'text' }).subscribe({
      next: data  => console.log('Response from API 1:', data),
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
