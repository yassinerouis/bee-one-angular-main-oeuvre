import { Error404Component } from './../error-pages/error404/error404.component';
import { OuvrierComponent } from './ouvriers/ouvrier.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {CookieService} from 'ngx-cookie-service';
import {CheckboxModule} from 'primeng/checkbox';
import {TabViewModule} from 'primeng/tabview';
import {RadioButtonModule} from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { QRCodeModule } from 'angular2-qrcode';
import { PresenceComponent } from './pointage-presense/presence/presence.component';
import {CardModule} from 'primeng/card';
import {StepsModule} from 'primeng/steps';
import { HttpLoaderFactory } from '../app.module';

const routes: Routes = [
  { path: 'ouvriers', component: OuvrierComponent },
  { path: 'presence', component: PresenceComponent },
  { path: '**', component: Error404Component }
]

@NgModule({
  declarations: [OuvrierComponent, PresenceComponent],
  imports: [
    CommonModule,
    CardModule,
    StepsModule,
    RouterModule.forChild(routes),
    TableModule,
    CalendarModule,
    SliderModule,
		DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
    ButtonModule,
    QRCodeModule,
    SweetAlert2Module.forRoot(),
    ToastModule,
    FormsModule,
    RadioButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    TabViewModule,
    TooltipModule,
    InputTextareaModule,
    InputNumberModule,
    MessageModule,
    CheckboxModule,
    MessagesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [DatePipe,CookieService,MessageService],
  exports:[TranslateModule]
})
export class MainOeuvreModule { }
