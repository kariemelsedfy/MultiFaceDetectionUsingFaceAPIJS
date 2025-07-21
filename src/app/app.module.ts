// src/app/app.module.ts
import { NgModule }        from '@angular/core';
import { BrowserModule }   from '@angular/platform-browser';
import { AppComponent }    from './app.component';
import { WebcamComponent } from './web-cam/web-cam.component';

@NgModule({
  declarations: [
    AppComponent,
    WebcamComponent
  ],
  imports: [
    BrowserModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
