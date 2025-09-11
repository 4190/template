import {Component, importProvidersFrom, inject, signal} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {routes} from './app.routes';

@Component({
  imports: [RouterOutlet, RouterModule],
  providers: [],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {

 
}
