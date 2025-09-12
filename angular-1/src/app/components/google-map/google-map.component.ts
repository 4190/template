import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface TouristAttraction {
  name: string;
  description: string;
  category: string;
  coordinates?: google.maps.LatLngLiteral;
  marker?: google.maps.Marker;
  place_id?: string; // Google Places ID for more precise identification
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Remove HTTP GeocodeResponse interface - we'll use Google Maps Geocoder directly

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, FormsModule],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss'
})
export class GoogleMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(GoogleMap) mapComponent!: GoogleMap;
  
  // Map instance and listeners
  private mapInstance: google.maps.Map | null = null;
  private clickListener: google.maps.MapsEventListener | null = null;
  private selectedMarker: google.maps.Marker | null = null;
  private attractionMarkers: google.maps.Marker[] = [];
  
  // Map configuration
  center: google.maps.LatLngLiteral = { lat: 52.2297, lng: 21.0122 }; // Warsaw coordinates
  zoom = 10;
  isMapLoaded = false;
  
  // Selected coordinates
  selectedCoordinates: google.maps.LatLngLiteral | null = null;
  selectedLocationName: string = '';
  
  // API Keys from environment
  openAiApiKey = environment.openaiApiKey;
  googleMapsApiKey = environment.googleMapsApiKey;
  isLoadingAttractions = false;
  attractions: TouristAttraction[] = [];
  errorMessage = '';
  
  // Map options optimized for performance
  mapOptions: google.maps.MapOptions = {
    center: this.center,
    zoom: this.zoom,
    disableDefaultUI: false,
    gestureHandling: 'cooperative',
    clickableIcons: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkGoogleMapsAPI();
  }

  ngAfterViewInit(): void {
    if (this.mapComponent && this.isMapLoaded) {
      this.initializeMap();
    }
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      google.maps.event.removeListener(this.clickListener);
    }
    if (this.selectedMarker) {
      this.selectedMarker.setMap(null);
    }
    this.clearAttractionMarkers();
    this.mapInstance = null;
  }

  private checkGoogleMapsAPI(): void {
    if (typeof google !== 'undefined' && google.maps) {
      this.isMapLoaded = true;
    } else {
      setTimeout(() => this.checkGoogleMapsAPI(), 100);
    }
  }

  private initializeMap(): void {
    if (this.mapComponent && !this.mapInstance) {
      this.mapInstance = this.mapComponent.googleMap!;
      
      this.clickListener = this.mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
        this.onMapClick(event);
      });
    }
  }

  onMapReady(map: google.maps.Map): void {
    this.mapInstance = map;
    console.log('Google Maps loaded successfully');
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng && this.mapInstance) {
      const lat = Number(event.latLng.lat().toFixed(6));
      const lng = Number(event.latLng.lng().toFixed(6));
      
      // Update selected coordinates
      this.selectedCoordinates = { lat, lng };
      
      // Remove previous marker
      if (this.selectedMarker) {
        this.selectedMarker.setMap(null);
      }
      
      // Add new marker at selected location
      this.selectedMarker = new google.maps.Marker({
        position: { lat, lng },
        map: this.mapInstance,
        title: `Selected: ${lat}, ${lng}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF4444"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });
      
      // Clear previous attractions and markers
      this.attractions = [];
      this.errorMessage = '';
      this.clearAttractionMarkers();
      
      // Perform reverse geocoding to get location name
      this.reverseGeocode(lat, lng);
      
      console.log('Selected coordinates:', { lat, lng });
    }
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    console.log('=== REVERSE GEOCODING START ===');
    console.log('Input coordinates:', { lat, lng });
    
    const geocoder = new google.maps.Geocoder();
    
    try {
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            console.log('Geocoding status:', status);
            console.log('Geocoding results:', results);
            
            if (status === 'OK' && results && results.length > 0) {
              resolve(results);
            } else {
              console.warn(`Reverse geocoding failed: ${status}`);
              resolve([]);
            }
          }
        );
      });

      if (results.length > 0) {
        // Get the most specific address (usually the first result)
        const address = results[0].formatted_address;
        this.selectedLocationName = address;
        
        // Try to extract city/town name from address components
        const addressComponents = results[0].address_components;
        let cityName = '';
        
        // Look for locality (city) or administrative_area_level_2 (county/district)
        for (const component of addressComponents) {
          if (component.types.includes('locality')) {
            cityName = component.long_name;
            break;
          } else if (component.types.includes('administrative_area_level_2')) {
            cityName = component.long_name;
          }
        }
        
        if (cityName) {
          this.selectedLocationName = `${cityName}, ${results[0].formatted_address}`;
        }
        
        // Update marker title with location name
        if (this.selectedMarker) {
          this.selectedMarker.setTitle(`Selected: ${this.selectedLocationName}`);
        }
        
        console.log('Final location name:', this.selectedLocationName);
        console.log('City name extracted:', cityName);
      } else {
        this.selectedLocationName = `Location at ${lat}, ${lng}`;
        console.log('No results, using fallback:', this.selectedLocationName);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      this.selectedLocationName = `Location at ${lat}, ${lng}`;
    }
    
    console.log('=== REVERSE GEOCODING END ===');
  }

  async findTouristAttractions(): Promise<void> {
    if (!this.selectedCoordinates) {
      this.errorMessage = 'Please select a location on the map first';
      return;
    }

    if (!this.openAiApiKey || this.openAiApiKey === 'YOUR_OPENAI_API_KEY') {
      this.errorMessage = 'Please configure your OpenAI API key in the .env file';
      return;
    }

    this.isLoadingAttractions = true;
    this.errorMessage = '';
    this.attractions = [];
    this.clearAttractionMarkers();

    // Wait for reverse geocoding to complete if location name is not set yet
    if (!this.selectedLocationName || this.selectedLocationName.startsWith('Location at')) {
      console.log('Waiting for reverse geocoding to complete...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
    
    const locationInfo = this.selectedLocationName && !this.selectedLocationName.startsWith('Location at')
      ? this.selectedLocationName
      : `coordinates ${this.selectedCoordinates.lat}, ${this.selectedCoordinates.lng}`;
    
    const prompt = `Find 3 most interesting tourist attractions near ${locationInfo}.
    
    IMPORTANT: Please provide REAL, EXISTING attractions with their EXACT names as they appear on Google Maps or Google Places.
    
    Please respond with a JSON array containing exactly 3 objects, each with:
    - name: string (EXACT real attraction name as it appears on Google Maps/Places)
    - description: string (brief factual description, max 100 words)
    - category: string (type: historical, natural, cultural, entertainment, religious, museum, park, etc.)
    
    Example format:
    [
      {
        "name": "Real Attraction Name",
        "description": "Factual description of the real attraction...",
        "category": "historical"
      }
    ]
    
    Location context: ${locationInfo}
    Reference coordinates: ${this.selectedCoordinates.lat}, ${this.selectedCoordinates.lng}
    
    IMPORTANT:
    - Make sure all attraction names are EXACT and can be found on Google Places
    - Use official names as they appear in Google Maps
    - Focus on well-known, established tourist attractions
    - DO NOT provide coordinates - only names and descriptions
    
    Respond only with the JSON array, no additional text.`;

    console.log('=== OPENAI PROMPT ===');
    console.log('Location Info:', locationInfo);
    console.log('Selected Location Name:', this.selectedLocationName);
    console.log('Selected Coordinates:', this.selectedCoordinates);
    console.log('Full Prompt:');
    console.log(prompt);
    console.log('=== END PROMPT ===');

    try {
      const response = await this.http.post<OpenAIResponse>('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openAiApiKey}`,
          'Content-Type': 'application/json'
        }
      }).toPromise();

      if (response && response.choices && response.choices[0]) {
        const content = response.choices[0].message.content.trim();
        
        try {
          // Parse JSON response
          const parsedAttractions = JSON.parse(content);
          
          if (Array.isArray(parsedAttractions) && parsedAttractions.length > 0) {
            this.attractions = parsedAttractions.slice(0, 3); // Ensure max 3 attractions
            
            // Log attractions received from OpenAI
            console.log('Attractions received from OpenAI:', this.attractions);
            
            // Geocode and add markers for each attraction
            await this.geocodeAndAddMarkers();
          } else {
            this.errorMessage = 'No attractions found for this location';
          }
        } catch (parseError) {
          console.error('Error parsing OpenAI response:', parseError);
          this.errorMessage = 'Error processing attractions data';
        }
      } else {
        this.errorMessage = 'No response from OpenAI';
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      this.errorMessage = 'Error connecting to OpenAI API. Please check your API key and try again.';
    } finally {
      this.isLoadingAttractions = false;
    }
  }

  private async geocodeAndAddMarkers(): Promise<void> {
    if (!this.mapInstance || !this.selectedCoordinates) return;

    console.log('Starting geocoding for attractions:', this.attractions);

    // Use Google Maps Geocoder service instead of HTTP API
    const geocoder = new google.maps.Geocoder();

    for (let i = 0; i < this.attractions.length; i++) {
      const attraction = this.attractions[i];
      
      try {
        console.log(`Geocoding attraction ${i + 1}: ${attraction.name}`);
        
        console.log(`🔍 Searching for "${attraction.name}" using Google Geocoder with location bias`);
        
        // Use improved Google Geocoder with location bias and region
        const geocodeResult = await new Promise<google.maps.GeocoderResult[]>((resolve) => {
          const geocodeRequest: google.maps.GeocoderRequest = {
            address: attraction.name,
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(
                this.selectedCoordinates!.lat - 0.5,
                this.selectedCoordinates!.lng - 0.5
              ),
              new google.maps.LatLng(
                this.selectedCoordinates!.lat + 0.5,
                this.selectedCoordinates!.lng + 0.5
              )
            ),
            region: 'PL' // Bias towards Poland
          };
          
          geocoder.geocode(geocodeRequest, (results, status) => {
            console.log(`Geocoder status for "${attraction.name}": ${status}`);
            
            if (status === 'OK' && results && results.length > 0) {
              console.log(`✅ Found ${results.length} geocoder results for "${attraction.name}"`);
              resolve(results);
            } else {
              console.warn(`❌ Geocoder failed for ${attraction.name}: ${status}`);
              resolve([]);
            }
          });
        });

        if (geocodeResult.length > 0) {
          const location = geocodeResult[0].geometry.location;
          attraction.coordinates = {
            lat: location.lat(),
            lng: location.lng()
          };
          
          console.log(`✅ Google Geocoder found coordinates for ${attraction.name}:`, attraction.coordinates);
          console.log(`📍 Address: ${geocodeResult[0].formatted_address}`);
          
          // Create marker for this attraction
          const marker = new google.maps.Marker({
            position: attraction.coordinates,
            map: this.mapInstance,
            title: attraction.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="${this.getCategoryColor(attraction.category)}"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${i + 1}</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #333;">${attraction.name}</h3>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${attraction.description}</p>
                <span style="background: ${this.getCategoryColor(attraction.category)}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                  ${this.getCategoryIcon(attraction.category)} ${attraction.category.toUpperCase()}
                </span>
              </div>
            `
          });

          marker.addListener('click', () => {
            // Close all other info windows
            this.attractionMarkers.forEach(m => {
              if ((m as any).infoWindow) {
                (m as any).infoWindow.close();
              }
            });
            infoWindow.open(this.mapInstance, marker);
          });

          // Store reference to info window
          (marker as any).infoWindow = infoWindow;
          attraction.marker = marker;
          this.attractionMarkers.push(marker);

          console.log(`Added marker for ${attraction.name}`);
        } else {
          console.warn(`❌ Could not find coordinates for ${attraction.name} - skipping marker`);
        }
      } catch (error) {
        console.error(`Error geocoding attraction ${attraction.name}:`, error);
      }
    }

    console.log(`Added ${this.attractionMarkers.length} markers to map`);

    // Adjust map view to show all markers
    this.adjustMapView();
  }

  private adjustMapView(): void {
    if (!this.mapInstance || this.attractionMarkers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    
    // Include selected location
    if (this.selectedCoordinates) {
      bounds.extend(this.selectedCoordinates);
    }
    
    // Include all attraction markers
    this.attractionMarkers.forEach(marker => {
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
      }
    });

    this.mapInstance.fitBounds(bounds);
    
    // Ensure minimum zoom level
    const listener = google.maps.event.addListener(this.mapInstance, 'bounds_changed', () => {
      if (this.mapInstance!.getZoom()! > 15) {
        this.mapInstance!.setZoom(15);
      }
      google.maps.event.removeListener(listener);
    });
  }

  private clearAttractionMarkers(): void {
    this.attractionMarkers.forEach(marker => {
      if ((marker as any).infoWindow) {
        (marker as any).infoWindow.close();
      }
      marker.setMap(null);
    });
    this.attractionMarkers = [];
    
    // Clear marker references from attractions
    this.attractions.forEach(attraction => {
      attraction.marker = undefined;
      attraction.coordinates = undefined;
    });
  }

  clearSelection(): void {
    this.selectedCoordinates = null;
    this.selectedLocationName = '';
    this.attractions = [];
    this.errorMessage = '';
    
    if (this.selectedMarker) {
      this.selectedMarker.setMap(null);
      this.selectedMarker = null;
    }
    
    this.clearAttractionMarkers();
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'historical': '🏛️',
      'natural': '🌲',
      'cultural': '🎭',
      'entertainment': '🎢',
      'religious': '⛪',
      'museum': '🏛️',
      'park': '🌳',
      'beach': '🏖️',
      'mountain': '⛰️',
      'default': '📍'
    };
    
    return icons[category.toLowerCase()] || icons['default'];
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'historical': '#8B4513',
      'natural': '#228B22',
      'cultural': '#9932CC',
      'entertainment': '#FF6347',
      'religious': '#4169E1',
      'museum': '#B8860B',
      'park': '#32CD32',
      'beach': '#20B2AA',
      'mountain': '#696969',
      'default': '#4285F4'
    };
    
    return colors[category.toLowerCase()] || colors['default'];
  }

  // Method to focus on specific attraction
  focusOnAttraction(attraction: TouristAttraction): void {
    if (attraction.coordinates && this.mapInstance) {
      this.mapInstance.setCenter(attraction.coordinates);
      this.mapInstance.setZoom(16);
      
      // Open info window if marker exists
      if (attraction.marker && (attraction.marker as any).infoWindow) {
        (attraction.marker as any).infoWindow.open(this.mapInstance, attraction.marker);
      }
    }
  }
}
