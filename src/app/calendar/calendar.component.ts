import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import { EventFormComponent } from '../event-form/event-form.component';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { Router } from '@angular/router';


type EventData = {
  name: string;
  date: string | number | Date;
  amount: number;
  notes: string;
  packages: string;
  phoneNumber: string;
  salesPerson: string;
  time: string;
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    // Fetch events from your backend when the component initializes
    this.loadEvents();
  }



  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    timeZone: 'UTC',
    plugins: [dayGridPlugin],
    weekends: true, // initial value
    events: [], // You can add your events data here if needed
    eventClick: this.handleEventClick.bind(this),
 
  };

  eventsPromise!: Promise<EventInput>;

  handleEventClick(info: EventClickArg) {
    const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
      width: '400px',
      data: {
        event: {
          title: info.event.title, // Name
          extendedProps: {
            phoneNumber: info.event.extendedProps['phoneNumber'],
            packages: info.event.extendedProps['packages'],
            time: info.event.extendedProps['time'],
            salesPerson: info.event.extendedProps['salesPerson'],
            notes: info.event.extendedProps['notes'],
            amount: info.event.extendedProps['amount']
          }
        }
      }
    });
  }

  openEventForm() {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '400px',
      data: { refreshCalendar: this.loadEvents.bind(this) } // You can pass initial data to the form component if needed.
    });
  }

  loadEvents() {
    // Make an HTTP GET request to fetch events (name and date) from your backend
    const apiUrl = 'http://localhost:8080/appointments/list'; // Update with your backend API endpoint
    fetch(apiUrl)
      .then(response => response.json())
      .then(events => {
        // Map the fetched data to FullCalendar format
        const mappedEvents: EventInput[] = events.map((event: EventData) => {
          const color = this.getEventColor(event.packages);
          
          // Convert the date string to a JavaScript Date object
          const date = new Date(event.date);
          
          // Format the date as 'YYYY-MM-DD'
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          
          return {
            title: event.name,
            start: formattedDate,
            color: color,
            extendedProps: {
              amount: event.amount,
              notes: event.notes,
              packages: event.packages,
              phoneNumber: event.phoneNumber,
              salesPerson: event.salesPerson,
              time: event.time,
              date: formattedDate
            }
          };
        });
        
        // Update the events property in calendarOptions with the mapped events
        this.calendarOptions.events = mappedEvents;
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }

  getEventColor(packageType: string): string {
    switch (packageType) {
      case 'Aesthetic':
        return '#FF647F';
      case 'Plastic Surgery':
        return 'red';
      case 'Hair':
        return 'blue';
      case 'Dental':
        return '#30D5C8'
      default:
        return 'gray'; // Default color if no match is found
    }
  }

  logout() {
    
    this.router.navigate(['/login']); // '/login' should be the route to your login component
  }
  

}
