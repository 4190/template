import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-test-route',
  standalone: true, // This makes the component standalone
  imports: [
    JsonPipe, // Import the json pipe for use in the template
    NgIf      // Import the NgIf directive for use in the template
  ],
  templateUrl: './test-route.component.html',
  styleUrl: './test-route.component.scss'
})
export class TestRouteComponent {
  // Inject the HttpClient service to make requests
  private http = inject(HttpClient);

  // Properties to hold the response or an error from the API call
  response: any = null;
  error: any = null;

  /**
   * This method is called when the button in the template is clicked.
   */
  callTemplateApi() {
    // Reset previous results
    this.response = null;
    this.error = null;
    console.log('Calling /api/template/getall...');

    // Your Ingress controller routes this request to the correct service inside the cluster.
    // The request from the browser goes to `http://localhost/api/template/getall`.
    this.http.get('/api/template/getall').subscribe({
      next: (data: any) => { // Explicitly type 'data' to fix TS7006 error
        console.log('Response from /api/template/getall:', data);
        this.response = data; // Store the successful response
      },
      error: (error: any) => { // Explicitly type 'error' to fix TS7006 error
        console.error('Error from /api/template/getall:', error);
        this.error = error; // Store the error response
      }
    });
  }
}

