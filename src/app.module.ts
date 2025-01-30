import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app/app.routes';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* PrimeNG components */
import { TableModule } from "primeng/table";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessagesModule } from 'primeng/messages';
import { TabMenuModule } from 'primeng/tabmenu';
import { PaginatorModule } from 'primeng/paginator';

/* Project components */
import {
  AppComponent, HtmlreaderDirectiveHeader,
  HtmlreaderDirectiveFooter
} from './app/app.component';
import { PageHeaderComponent } from './app/page-header/page-header.component';
import { CurrencyComponent } from './app/currency/currency.component';

/* Services */
import { HttpService } from "./app/services/http.service";
import { ConfigService } from "./app/services/config.service";
import { ConfigLoader } from "./app/services/config-loader";
import { provideHttpClient } from '@angular/common/http';


/* Pipes */
import { FromatIEDatePipe } from './app/pipes/fromat-ie-date.pipe';

/* Message Service */
import { MessageService } from 'primeng/api';
import { FixAutocompleteAttributesDirective } from './app/currency/fix-autocomplete-attributes.directive';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyComponent,
    FromatIEDatePipe,
    PageHeaderComponent,
    FixAutocompleteAttributesDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    TableModule,
    AutoCompleteModule,
    CalendarModule,
    AccordionModule,
    RadioButtonModule,
    PaginatorModule,
    MessagesModule,
    TabMenuModule,
  ],
  providers: [
    ConfigService,
    HttpService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigService],
      multi: true
    },
    MessageService,
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
