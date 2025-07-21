import { Component } from '@angular/core';
import { WebcamComponent } from './web-cam/web-cam.component';
@Component({
  imports: [WebcamComponent],
  selector: 'app-root',
  template: `<app-webcam></app-webcam>`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // you can leave this empty or use `title` if you like
}
