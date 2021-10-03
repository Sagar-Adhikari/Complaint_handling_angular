import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { InterceptorService } from '../services/interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ProgressBarModule } from 'angular-progress-bar';
// import { environment } from 'src/environments/environment.prod';

import { MatButtonModule, MatMenuModule, MatRadioModule, MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { GaugesModule } from 'ng-canvas-gauges';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafePipe } from './pipes/safe.pipe';

//const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
  declarations: [
    SafePipe
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
   // SocketIoModule.forRoot(config),
    HttpClientModule,
    ProgressBarModule,
    GaugesModule,
    MatButtonModule, MatMenuModule, MatRadioModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatCardModule, MatInputModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  exports: []
})
export class PublicModule { }