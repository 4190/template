import { Routes } from '@angular/router';
import { GoogleMapComponent } from './components/google-map/google-map.component';
// Corrected imports below
import { TestRouteComponent } from './components/test-route/test-route.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Corrected component class names below
  { path: '', component: HomeComponent },
  { path: 'google-map', component: GoogleMapComponent },
  { path: 'test', component: TestRouteComponent }
];
