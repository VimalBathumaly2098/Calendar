import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  event: any = {
    name: '',
    phoneNumber: '',
    packages: '',
    date: null, // Initialize date as null
    time: '',
    salesPerson: '',
    notes: '',
    amount: ''
  };

  constructor(
    private dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  saveEvent() {
    // Make an HTTP POST request to your backend API
    const apiUrl = 'http://localhost:8080/appointments/create'; // Update with your backend API endpoint
    this.http.post(apiUrl, this.event).subscribe(
      (response) => {
        console.log('Event saved successfully', response);
        
        this.dialogRef.close();

        if (this.data && this.data.refreshCalendar) {
          this.data.refreshCalendar();
        }
      },
      (error) => {
        console.error('Error saving event', error);
        // Log the error response from the backend
        console.log(error.error); // or console.log(error) to see the full error response
        // Handle error if needed
      }
    );
  }

  cancel() {
    this.dialogRef.close(); // Close the dialog without saving
  }

  // Function to handle date changes
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.event.date = event.value;
  }
}
