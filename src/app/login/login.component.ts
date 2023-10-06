import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  hovered: boolean = false;

  constructor(private router: Router, private httpClient: HttpClient, private snackBar: MatSnackBar) {}

  login() {
    // Create an object to send to the backend

  

    const user = {
      email: this.email,
      password: this.password
    };

    if (!this.email || !this.password) {
      // Show a warning for empty email or password
      this.showWarning('Please enter both email and password.');
      return;
    }

    // Send a POST request to your backend API for login
    this.httpClient.post('http://localhost:8080/users/login', user, { responseType: 'text' })
      .subscribe(
        (response: string) => {
          // Handle the plain text response
          console.log('Login response:', response);

          if (response === 'Login successful') {
            // Redirect to the user's dashboard or home page upon successful login
            console.log('Navigating to dashboard...');
            this.router.navigate(['/calendar']);
          } else {
            // Handle login failure
            this.showWarning('Invalid email or password. Please try again.');
          }
        },
        (error: any) => {
          // Handle any errors, such as network issues or server errors
          this.showWarning('Login failed. Please try again later.');
        }
      );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onMouseEnter() {
    this.hovered = true;
  }

  onMouseLeave() {
    this.hovered = false;
  }

  showWarning(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000; // Duration in milliseconds (3 seconds)
    this.snackBar.open(message, 'Close', config);
  }
}
