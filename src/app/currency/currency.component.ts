import { Component, ElementRef, OnInit, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CurrencyGate } from '../models/CurrencyGate';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { HttpService } from '../services/http.service'
import { Calendar } from 'primeng/calendar';
import { environment } from '../../environments/environment';
import { AutoComplete } from 'primeng/autocomplete';


@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss', '../../../node_modules/primeng/resources/themes/nova/theme.css', '../../styles.scss']
})
export class CurrencyComponent implements OnInit {

  title: string = "שאילתת שערי מטבע - רשות המיסים בישראל";
  descriptionLines: string[] = ['הצגת שערי המכס שנקבעו למטבע הנבחר או כלל המטבעות על פי טווח תאריכים.', 'שער יציג של המטבע לפי בנק ישראל בתוספת 0.5%.'];

  yearRange: string = '';
  fromDate: Date = new Date();
  toDate: Date = new Date();
  selectedCurrency: any;
  filteredData: CurrencyGate[] = [];
  currencyTypeList: CurrencyGate[] = [];
  gridData: CurrencyGate[] = [];
  myData1: string = '';
  columns: any[] = [];
  isSuggestionsVisible: boolean = false;

  constructor(private el: ElementRef, private httpService: HttpService, private renderer: Renderer2, private cdRef: ChangeDetectorRef) { }

  currentIndex: number = 0;
  private shaarolamiBaseUrl = environment.baseUrls.shaarolami;

  ngOnInit() {
    let tdate: Date = new Date();
    this.yearRange = (tdate.getFullYear() - 10).toString() + ':' + tdate.getFullYear();
    this.callService(`${this.shaarolamiBaseUrl}/CustomsPilotWeb/CurrencyRates/api/GetRates?fromDate=${this.FromDateString}&toDate=${this.ToDateString}`, 'GET').
      subscribe(response => { this.onSuccess(response) },
        error => { console.error(error) });

    this.columns = [
      { field: 'currencyTypeName', header: 'שם מטבע' },
      { field: 'currencyTypeID', header: 'קוד מטבע' },
      { field: 'customsCurrencyRate', header: 'שיעור מכס' },
      { field: 'startDate', header: 'מתאריך תוקף' },
      { field: 'endDate', header: 'עד תאריך תוקף' }
    ];
  }

  private callService(url: string, method: string): Observable<string> {
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.open(method, url, true);
      xhr.send();
    });
  }

  private onSuccess(data: any) {
    let pattern: string = this.selectedCurrencyString;

    this.gridData = this.filteredData = (data || []).map(
      (r: any) =>
        new CurrencyGate(
          new Date(r.startDate),
          new Date(r.endDate),
          r.currencyTypeID,
          r.currencyTypeName,
          r.customsCurrencyRate
        )
    );
    this.filteredData = this.filteredData.filter(r => (pattern == undefined || pattern == "הכל" || r.displayText.toLowerCase().indexOf(pattern) >= 0)).
      sort((a, b) => {
        let aIndex = a.displayText.toLowerCase().indexOf(pattern);
        let bIndex = b.displayText.toLowerCase().indexOf(pattern);

        return (aIndex < bIndex) ? -1 : ((aIndex > bIndex) ? 1 : 0);
      });
    this.initCurrencyTypesList(this.filteredData);
  }


  get selectedCurrencyString(): string {
    if (this.selectedCurrency == undefined)
      return '';
    return typeof this.selectedCurrency === "string" ? this.selectedCurrency.toLowerCase() : this.selectedCurrency.displayText.toLowerCase();

  }

  get selectedCurrencyApiString(): string {
    if (this.selectedCurrency == undefined || this.selectedCurrency.currencyTypeID == null)
      return "";

    return `&currencyCode=${(typeof this.selectedCurrency === "string" ? this.selectedCurrency : this.selectedCurrency.currencyTypeID)}`;

  }

  get FromDateString(): string {
    let date = this.fromDate != undefined ? this.fromDate : (this.toDate == undefined ? new Date() : this.toDate);

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  }

  get ToDateString(): string {
    let date = this.toDate != undefined ? this.toDate : new Date();

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  @ViewChild('autoComplete') autoComplete!: AutoComplete;

  initCurrencyTypesList(list: CurrencyGate[]) {
    this.currencyTypeList = list.filter((elem, index, self) => index === self.findIndex(i => i.currencyTypeName == elem.currencyTypeName));
    this.currencyTypeList.splice(0, 0, new CurrencyGate(new Date(0), new Date(), '', "הכל", ''));
    this.isSuggestionsVisible = this.currencyTypeList.length > 0;
    this.renderer.removeAttribute(this.autoComplete, 'aria-expanded');
  }

  searchData() {
    this.callService(`${this.shaarolamiBaseUrl}/CustomsPilotWeb/CurrencyRates/api/GetRates?fromDate=${this.FromDateString}&toDate=${this.ToDateString}${this.selectedCurrencyApiString}`, 'GET').
      subscribe(response => { this.onSuccess(response) },
        error => { console.error(error) });
    this.initCurrencyTypesList(this.filteredData);
    this.resetPaging();
  }

  completeData() {
    let pattern: string = this.selectedCurrencyString;
    this.filteredData = this.gridData.
      filter(r => (pattern == undefined || pattern == "הכל" || r.displayText.toLowerCase().indexOf(pattern) >= 0)).
      sort((a, b) => {
        let aIndex = a.displayText.toLowerCase().indexOf(pattern);
        let bIndex = b.displayText.toLowerCase().indexOf(pattern);
        return (aIndex < bIndex) ? -1 : ((aIndex > bIndex) ? 1 : 0);
      });
    this.initCurrencyTypesList(this.filteredData);
  }

  @ViewChild('myTable') myTable!: Table;

  setPaginationAriaLabels() {
    const paginator = this.myTable.el.nativeElement.querySelector('.p-paginator');
    if (paginator) {
      const firstButton = paginator.querySelector('.p-paginator-first');
      const prevButton = paginator.querySelector('.p-paginator-prev');
      const nextButton = paginator.querySelector('.p-paginator-next');
      const lastButton = paginator.querySelector('.p-paginator-last');

      if (firstButton) firstButton.setAttribute('aria-label', 'עמוד ראשון');
      if (prevButton) prevButton.setAttribute('aria-label', 'עמוד קודם');
      if (nextButton) nextButton.setAttribute('aria-label', 'עמוד הבא');
      if (lastButton) lastButton.setAttribute('aria-label', 'עמוד אחרון');
    }
  }

  setCurrencyLable() {
    let buttonTextSpan = document.querySelector('.p-button-text') as HTMLSpanElement;
    if (buttonTextSpan) {
      buttonTextSpan.innerHTML = 'בחר מטבע';
    }
  }

  @ViewChild('calendar1') calendar1!: Calendar;
  @ViewChild('calendar2') calendar2!: Calendar;

  setCalendarAccessibilityBtn() {
    const button1 = this.calendar1.el.nativeElement.querySelector('button');
    if (button1) {
      this.renderer.setProperty(button1, 'ariaLabel', 'בחר תאריך מלוח שנה');
      this.renderer.setProperty(button1, 'tabindex', 0,);
    }
    const button2 = this.calendar2.el.nativeElement.querySelector('button');
    if (button2) {
      this.renderer.setProperty(button2, 'ariaLabel', 'בחר תאריך מלוח שנה');
      this.renderer.setProperty(button2, 'tabindex', 0);
    }
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    this.renderer.addClass(document.getElementsByTagName("table")[0], "table-bordered");
    this.setCurrencyLable();
    this.setPaginationAriaLabels();
    this.setCalendarAccessibilityBtn();
  }

  onCalendarShow() {
    setTimeout(() => {
      if (document.getElementsByClassName('p-datepicker').length > 1) {
        const element = document.getElementsByClassName('p-datepicker')[0];
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }
      (document.getElementsByClassName('p-datepicker-prev')[0] as HTMLAnchorElement).setAttribute('aria-label', 'לחודש הקודם');
      (document.getElementsByClassName('p-datepicker-next')[0] as HTMLAnchorElement).setAttribute('aria-label', 'לחודש הבא');
      const year = (document.getElementsByClassName('p-datepicker-year')[0] as HTMLAnchorElement).textContent;
      (document.getElementsByClassName('p-datepicker-year')[0] as HTMLAnchorElement).setAttribute('aria-label', year + 'בחר שנה');
      const month = (document.getElementsByClassName('p-datepicker-month')[0] as HTMLAnchorElement).textContent;
      (document.getElementsByClassName('p-datepicker-month')[0] as HTMLAnchorElement).setAttribute('aria-label', month + 'בחר חודש');
    }, 0);
  }

  @ViewChild('dt') table!: Table;

  resetPaging() {
    this.currentIndex = 0;
    this.table.reset();
  }

  toggleDropdownVisibility() {
    this.isSuggestionsVisible = !this.isSuggestionsVisible;
  }
}
