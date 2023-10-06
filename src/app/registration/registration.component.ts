import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false; // Add this variable
  hovered: boolean = false; // Initialize to false

  constructor(private router: Router, private httpClient: HttpClient) {}

  register() {
    // Create an object to send to the backend
    const newUser = {
      email: this.email, // Use your API's expected field name for email
      password: this.password // Use your API's expected field name for password
    };

    // Send a POST request to your backend API
    this.httpClient.post('http://localhost:8080/users/register', newUser, { responseType: 'json' })
      .subscribe(
        (response: any) => {
          // Registration successful, handle the JSON response
          console.log('Registration response:', response);

          if (response && response.message === 'User registered successfully') {
            // Redirect to the login page or handle it as needed
            console.log('Navigating to login page...');
            this.router.navigate(['/login']);
          } else {
            console.log('Registration failed:', response);
          }
        },
        (error: any) => {
          // Handle registration failure or validation errors
          console.error('Registration failed:', error);
        }
      );
  }

  togglePassword() {
    // Toggle the password visibility
    this.showPassword = !this.showPassword;
  }

  onMouseEnter() {
    // User is hovering over the password input field
    this.hovered = true;
  }

  onMouseLeave() {
    // User is no longer hovering over the password input field
    this.hovered = false;
  }
}
