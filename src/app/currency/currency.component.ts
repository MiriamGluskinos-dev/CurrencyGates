import { Component, ElementRef, OnInit, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'


import { Observable } from 'rxjs/internal/Observable';

import { CurrencyGate } from '../models/CurrencyGate';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';

import { HttpService } from '../services/http.service'
import { Calendar } from 'primeng/calendar';




@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss', '../../../node_modules/primeng/resources/themes/nova/theme.css']
})
export class CurrencyComponent implements OnInit {

  title: string = "שאילתת שערי מטבע - רשות המיסים בישראל";
  descriptionLines: string[] = ['הצגת שערי המכס שנקבעו למטבע הנבחר או כלל המטבעות על פי טווח תאריכים.', 'שער יציג של המטבע לפי בנק ישראל בתוספת 0.5%.'];

  yearRange: string = '';
  fromDate: Date = new Date();
  toDate: Date = new Date();
  heIL: any;

  selectedCurrency: any;

  filteredData: CurrencyGate[] = [];
  currencyTypeList: CurrencyGate[] = [];
  gridData: CurrencyGate[] = [];
  myData1: string = '';
  columns: any[] = [];
  isSuggestionsVisible: boolean = false;

  constructor(private el: ElementRef, private httpService: HttpService, private renderer: Renderer2, private cdRef: ChangeDetectorRef) { }

  currentIndex: number = 0;

  ngOnInit() {

    let tdate: Date = new Date();
    this.yearRange = (tdate.getFullYear() - 10).toString() + ':' + tdate.getFullYear();


    let mockData = [
      {
        "startDate": "2018-01-09 00:00:00",
        "endDate": "9999-12-31 00:00:00",
        "currencyTypeID": "ILS",
        "currencyTypeName": "שקל ישראלי חדש",
        "customsCurrencyRate": "1.0000000000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "EUR",
        "currencyTypeName": "אירו",
        "customsCurrencyRate": "4.1051235000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "THB",
        "currencyTypeName": "באט תאילנד",
        "customsCurrencyRate": "0.1114006531"
      },
      {
        "startDate": "2024-11-10 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "ETB",
        "currencyTypeName": "ביר אתיופי",
        "customsCurrencyRate": "0.0301966530"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AUD",
        "currencyTypeName": "דולר אוסטרלי",
        "customsCurrencyRate": "2.4802395000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "USD",
        "currencyTypeName": "דולר ארה\"ב",
        "customsCurrencyRate": "3.7798050000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "HKD",
        "currencyTypeName": "דולר הונג-קונג",
        "customsCurrencyRate": "0.4860017211"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "TWD",
        "currencyTypeName": "דולר טיוואני",
        "customsCurrencyRate": "0.1185791601"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "NZD",
        "currencyTypeName": "דולר ניו זילנדי",
        "customsCurrencyRate": "2.2600744427"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "SGD",
        "currencyTypeName": "דולר סינגפור",
        "customsCurrencyRate": "2.8547190260"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CAD",
        "currencyTypeName": "דולר קנדי",
        "customsCurrencyRate": "2.7129975000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "VND",
        "currencyTypeName": "דונג וייאטנמי",
        "customsCurrencyRate": "0.0001493993"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "JOD",
        "currencyTypeName": "דינר ירדני",
        "customsCurrencyRate": "5.3310225000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "IQD",
        "currencyTypeName": "דינר עיראקי",
        "customsCurrencyRate": "0.0028848591"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AED",
        "currencyTypeName": "דירהם איחוד האמירויות הערביות",
        "customsCurrencyRate": "1.0290929792"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AMD",
        "currencyTypeName": "דראם ארמני",
        "customsCurrencyRate": "0.0097626566"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UAH",
        "currencyTypeName": "הריבניה אוקריאנה",
        "customsCurrencyRate": "0.0914396618"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "KRW",
        "currencyTypeName": "ואן דרום קוריאה",
        "customsCurrencyRate": "0.0027438003"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "PLN",
        "currencyTypeName": "זלוטי פולין",
        "customsCurrencyRate": "0.9416287130"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "KZT",
        "currencyTypeName": "טנגה",
        "customsCurrencyRate": "0.0077275144"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CNY",
        "currencyTypeName": "יואן סיני",
        "customsCurrencyRate": "0.5306927526"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "JPY",
        "currencyTypeName": "יין יפני",
        "customsCurrencyRate": "0.0247601850"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "DKK",
        "currencyTypeName": "כתר דני",
        "customsCurrencyRate": "0.5502375000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "NOK",
        "currencyTypeName": "כתר נורבגי",
        "customsCurrencyRate": "0.3439110000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CZK",
        "currencyTypeName": "כתר צ'כי",
        "customsCurrencyRate": "0.1620914216"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "MDL",
        "currencyTypeName": "לאו מולדובני",
        "customsCurrencyRate": "0.2111281678"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "GEL",
        "currencyTypeName": "לארי גאורגי",
        "customsCurrencyRate": "1.3769811518"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "BGN",
        "currencyTypeName": "לב בולגרי",
        "customsCurrencyRate": "2.1013205646"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "TRY",
        "currencyTypeName": "לירה טורקית חדשה",
        "customsCurrencyRate": "0.1100866248"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "EGP",
        "currencyTypeName": "לירה מצרית",
        "customsCurrencyRate": "0.0771840000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "GBP",
        "currencyTypeName": "לירה שטרלינג",
        "customsCurrencyRate": "4.8784710000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AZN",
        "currencyTypeName": "מאנאט אזרבייג'ני חדש",
        "customsCurrencyRate": "2.2207628538"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "RON",
        "currencyTypeName": "ניו לאוי רומניה",
        "customsCurrencyRate": "0.8247621649"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "GHS",
        "currencyTypeName": "סדי גנאי",
        "customsCurrencyRate": "0.2318451155"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "PEN",
        "currencyTypeName": "סול פרואני",
        "customsCurrencyRate": "1.0012277592"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UZS",
        "currencyTypeName": "סום אוזבקי",
        "customsCurrencyRate": "0.0002953594"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "HUF",
        "currencyTypeName": "פורינט הונגרי",
        "customsCurrencyRate": "0.0100552676"
      },
      {
        "startDate": "2024-11-10 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "MXN",
        "currencyTypeName": "פזו מקסיקני",
        "customsCurrencyRate": "0.1871075414"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "PHP",
        "currencyTypeName": "פזו פיליפיני",
        "customsCurrencyRate": "0.0646917116"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CLP",
        "currencyTypeName": "פזו צ'יליאני",
        "customsCurrencyRate": "0.0039314001"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "ARS",
        "currencyTypeName": "פסו ארגנטינאי",
        "customsCurrencyRate": "0.0038189488"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UYU",
        "currencyTypeName": "פסו של אורוגוואי",
        "customsCurrencyRate": "0.0912523540"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CHF",
        "currencyTypeName": "פרנק שויצרי",
        "customsCurrencyRate": "4.3554690000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "HRK",
        "currencyTypeName": "קונה",
        "customsCurrencyRate": "0.5486701320"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "SEK",
        "currencyTypeName": "קורונה שוודי",
        "customsCurrencyRate": "0.3538605000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "BYN",
        "currencyTypeName": "רובל בילרוסי חדש",
        "customsCurrencyRate": "1.1548134834"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "RUB",
        "currencyTypeName": "רובל רוסי",
        "customsCurrencyRate": "0.0386679136"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "NPR",
        "currencyTypeName": "רופי נפאלי",
        "customsCurrencyRate": "0.0280842741"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "INR",
        "currencyTypeName": "רופיה הודית",
        "customsCurrencyRate": "0.0449658010"
      },
      {
        "startDate": "2024-11-10 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "BRL",
        "currencyTypeName": "ריאל ברזיל",
        "customsCurrencyRate": "0.6493607269"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "SAR",
        "currencyTypeName": "ריאל סעודי",
        "customsCurrencyRate": "1.0064311070"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "QAR",
        "currencyTypeName": "ריאל קטארי",
        "customsCurrencyRate": "1.0366917295"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "ZAR",
        "currencyTypeName": "רנד ד. אפריקה",
        "customsCurrencyRate": "0.2140650000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UGX",
        "currencyTypeName": "שילינג אוגנדי",
        "customsCurrencyRate": "0.0010322363"
      }
    ]
    this.onSuccess(mockData);

    //פניה לשירות לצורך שליפת כל הנתונים
    // this.callService(`https://shaarolami-query.customs.mof.gov.il/CustomsPilotWeb/CurrencyRates/api/GetRates?fromDate=${this.FromDateString}&toDate=${this.ToDateString}`, 'GET').
    //   subscribe(response => { this.onSuccess(response) },
    //     error => { console.error(error) });

    this.heIL = {
      firstDayOfWeek: 0,
      dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
      dayNamesShort: ["ראש", "שני", "שלי", "רבי", "חמי", "שיש", "שבת"],
      dayNamesMin: ["א", "ב", "ג", "ד", "ה", "ו", "ז"],
      monthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
      monthNamesShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"],
      today: 'היום',
      clear: 'נקה'


    };


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


    // this.gridData = this.filteredData = data.map(r => new CurrencyGate(r.startDate, r.endDate, r.currencyTypeID, r.currencyTypeName, r.customsCurrencyRate)).filter(r => 1 == 1);
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
    this.filteredData = this.filteredData.filter(r => (pattern == undefined || pattern == "הכל" || r.displayText.toLowerCase().indexOf(pattern) >= 0)). //פילטור לפי הטקסט בתיבת הבחירה
      sort((a, b) => { //מיון לפי החיפוש
        let aIndex = a.displayText.toLowerCase().indexOf(pattern);
        let bIndex = b.displayText.toLowerCase().indexOf(pattern);

        return (aIndex < bIndex) ? -1 : ((aIndex > bIndex) ? 1 : 0);

      });   // sort((a, b) => (a.currencyTypeName < b.currencyTypeName) ? -1 : ((a.currencyTypeName > b.currencyTypeName) ? 1 : 0));



    this.initCurrencyTypesList(this.filteredData);

  }


  //לצורך החיפוש האוטו-קומפלט 
  get selectedCurrencyString(): string {


    if (this.selectedCurrency == undefined)
      return '';

    return typeof this.selectedCurrency === "string" ? this.selectedCurrency.toLowerCase() : this.selectedCurrency.displayText.toLowerCase();

  }


  //לצורך שליחה לשירות משורשר שם הפרמטר, מחזיר נתונים רק במידה ונבחר ערך ולא נמצא עדיין באמצע חיפוש
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



  initCurrencyTypesList(list: CurrencyGate[]) {

    //הסרת רשומות כפולות
    this.currencyTypeList = list.filter((elem, index, self) => index === self.findIndex(i => i.currencyTypeName == elem.currencyTypeName));

    //הוספת ערך:הכל
    this.currencyTypeList.splice(0, 0, new CurrencyGate(new Date(0), new Date(), '', "הכל", ''));
    this.isSuggestionsVisible = this.currencyTypeList.length > 0;

  }

  searchData() {

    let mockData = [
      {
        "startDate": "2018-01-09 00:00:00",
        "endDate": "9999-12-31 00:00:00",
        "currencyTypeID": "ILS",
        "currencyTypeName": "שקל ישראלי חדש",
        "customsCurrencyRate": "1.0000000000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "EUR",
        "currencyTypeName": "אירו",
        "customsCurrencyRate": "4.1051235000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "THB",
        "currencyTypeName": "באט תאילנד",
        "customsCurrencyRate": "0.1114006531"
      },
      {
        "startDate": "2024-11-10 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "ETB",
        "currencyTypeName": "ביר אתיופי",
        "customsCurrencyRate": "0.0301966530"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AUD",
        "currencyTypeName": "דולר אוסטרלי",
        "customsCurrencyRate": "2.4802395000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "USD",
        "currencyTypeName": "דולר ארה\"ב",
        "customsCurrencyRate": "3.7798050000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "HKD",
        "currencyTypeName": "דולר הונג-קונג",
        "customsCurrencyRate": "0.4860017211"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "TWD",
        "currencyTypeName": "דולר טיוואני",
        "customsCurrencyRate": "0.1185791601"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "NZD",
        "currencyTypeName": "דולר ניו זילנדי",
        "customsCurrencyRate": "2.2600744427"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "SGD",
        "currencyTypeName": "דולר סינגפור",
        "customsCurrencyRate": "2.8547190260"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CAD",
        "currencyTypeName": "דולר קנדי",
        "customsCurrencyRate": "2.7129975000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "VND",
        "currencyTypeName": "דונג וייאטנמי",
        "customsCurrencyRate": "0.0001493993"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "JOD",
        "currencyTypeName": "דינר ירדני",
        "customsCurrencyRate": "5.3310225000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "IQD",
        "currencyTypeName": "דינר עיראקי",
        "customsCurrencyRate": "0.0028848591"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AED",
        "currencyTypeName": "דירהם איחוד האמירויות הערביות",
        "customsCurrencyRate": "1.0290929792"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AMD",
        "currencyTypeName": "דראם ארמני",
        "customsCurrencyRate": "0.0097626566"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UAH",
        "currencyTypeName": "הריבניה אוקריאנה",
        "customsCurrencyRate": "0.0914396618"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "KRW",
        "currencyTypeName": "ואן דרום קוריאה",
        "customsCurrencyRate": "0.0027438003"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "PLN",
        "currencyTypeName": "זלוטי פולין",
        "customsCurrencyRate": "0.9416287130"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "KZT",
        "currencyTypeName": "טנגה",
        "customsCurrencyRate": "0.0077275144"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CNY",
        "currencyTypeName": "יואן סיני",
        "customsCurrencyRate": "0.5306927526"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "JPY",
        "currencyTypeName": "יין יפני",
        "customsCurrencyRate": "0.0247601850"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "DKK",
        "currencyTypeName": "כתר דני",
        "customsCurrencyRate": "0.5502375000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "NOK",
        "currencyTypeName": "כתר נורבגי",
        "customsCurrencyRate": "0.3439110000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CZK",
        "currencyTypeName": "כתר צ'כי",
        "customsCurrencyRate": "0.1620914216"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "MDL",
        "currencyTypeName": "לאו מולדובני",
        "customsCurrencyRate": "0.2111281678"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "GEL",
        "currencyTypeName": "לארי גאורגי",
        "customsCurrencyRate": "1.3769811518"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "BGN",
        "currencyTypeName": "לב בולגרי",
        "customsCurrencyRate": "2.1013205646"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "TRY",
        "currencyTypeName": "לירה טורקית חדשה",
        "customsCurrencyRate": "0.1100866248"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "EGP",
        "currencyTypeName": "לירה מצרית",
        "customsCurrencyRate": "0.0771840000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "GBP",
        "currencyTypeName": "לירה שטרלינג",
        "customsCurrencyRate": "4.8784710000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "AZN",
        "currencyTypeName": "מאנאט אזרבייג'ני חדש",
        "customsCurrencyRate": "2.2207628538"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "RON",
        "currencyTypeName": "ניו לאוי רומניה",
        "customsCurrencyRate": "0.8247621649"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "GHS",
        "currencyTypeName": "סדי גנאי",
        "customsCurrencyRate": "0.2318451155"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "PEN",
        "currencyTypeName": "סול פרואני",
        "customsCurrencyRate": "1.0012277592"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UZS",
        "currencyTypeName": "סום אוזבקי",
        "customsCurrencyRate": "0.0002953594"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "HUF",
        "currencyTypeName": "פורינט הונגרי",
        "customsCurrencyRate": "0.0100552676"
      },
      {
        "startDate": "2024-11-10 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "MXN",
        "currencyTypeName": "פזו מקסיקני",
        "customsCurrencyRate": "0.1871075414"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "PHP",
        "currencyTypeName": "פזו פיליפיני",
        "customsCurrencyRate": "0.0646917116"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CLP",
        "currencyTypeName": "פזו צ'יליאני",
        "customsCurrencyRate": "0.0039314001"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "ARS",
        "currencyTypeName": "פסו ארגנטינאי",
        "customsCurrencyRate": "0.0038189488"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UYU",
        "currencyTypeName": "פסו של אורוגוואי",
        "customsCurrencyRate": "0.0912523540"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "CHF",
        "currencyTypeName": "פרנק שויצרי",
        "customsCurrencyRate": "4.3554690000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "HRK",
        "currencyTypeName": "קונה",
        "customsCurrencyRate": "0.5486701320"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "SEK",
        "currencyTypeName": "קורונה שוודי",
        "customsCurrencyRate": "0.3538605000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "BYN",
        "currencyTypeName": "רובל בילרוסי חדש",
        "customsCurrencyRate": "1.1548134834"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "RUB",
        "currencyTypeName": "רובל רוסי",
        "customsCurrencyRate": "0.0386679136"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "NPR",
        "currencyTypeName": "רופי נפאלי",
        "customsCurrencyRate": "0.0280842741"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "INR",
        "currencyTypeName": "רופיה הודית",
        "customsCurrencyRate": "0.0449658010"
      },
      {
        "startDate": "2024-11-10 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "BRL",
        "currencyTypeName": "ריאל ברזיל",
        "customsCurrencyRate": "0.6493607269"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "SAR",
        "currencyTypeName": "ריאל סעודי",
        "customsCurrencyRate": "1.0064311070"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "QAR",
        "currencyTypeName": "ריאל קטארי",
        "customsCurrencyRate": "1.0366917295"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "ZAR",
        "currencyTypeName": "רנד ד. אפריקה",
        "customsCurrencyRate": "0.2140650000"
      },
      {
        "startDate": "2024-11-05 00:00:00",
        "endDate": "2024-11-11 00:00:00",
        "currencyTypeID": "UGX",
        "currencyTypeName": "שילינג אוגנדי",
        "customsCurrencyRate": "0.0010322363"
      }
    ]
    this.onSuccess(mockData);
    //פניה לשירות לצורך שליפת כל הנתונים
    // this.callService(`https://shaarolami-query.customs.mof.gov.il/CustomsPilotWeb/CurrencyRates/api/GetRates?fromDate=${this.FromDateString}&toDate=${this.ToDateString}${this.selectedCurrencyApiString}`, 'GET').
    //   subscribe(response => { this.onSuccess(mockData) },
    //     error => { console.error(error) });


    this.initCurrencyTypesList(this.filteredData);


    //init paging
    this.resetPaging();



  }

  completeData() {

    let pattern: string = this.selectedCurrencyString;


    this.filteredData = this.gridData.
      filter(r => (pattern == undefined || pattern == "הכל" || r.displayText.toLowerCase().indexOf(pattern) >= 0)). //פילטור לפי הטקסט בתיבת הבחירה
      sort((a, b) => { //מיון לפי החיפוש
        let aIndex = a.displayText.toLowerCase().indexOf(pattern);
        let bIndex = b.displayText.toLowerCase().indexOf(pattern);

        return (aIndex < bIndex) ? -1 : ((aIndex > bIndex) ? 1 : 0);

      });   // sort((a, b) => (a.currencyTypeName < b.currencyTypeName) ? -1 : ((a.currencyTypeName > b.currencyTypeName) ? 1 : 0));



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
    if (button1) this.renderer.setProperty(button1, 'ariaLabel', 'בחר תאריך מלוח שנה');

    // const buttonText1 = this.calendar1.el.nativeElement.querySelector('.p-button-icon-only');
    // if (buttonText1) this.renderer.setProperty(buttonText1, 'innerHTML', 'לוח שנה');

    const button2 = this.calendar2.el.nativeElement.querySelector('button');
    if (button2) this.renderer.setProperty(button2, 'ariaLabel', 'בחר תאריך מלוח שנה');

    // const buttonText2 = this.calendar2.el.nativeElement.querySelector('.p-button-icon-only');
    // if (buttonText2) this.renderer.setProperty(buttonText2, 'innerHTML', 'לוח שנה');
  }

  setArrowsLabels() {
    this.calendar1.el.nativeElement.querySelector('p-datepicker-trigger').addEventListener('click',
      this.setArrows()
    );
  }

  setArrows() {
    const dateArowNext2 = this.calendar2.el.nativeElement.querySelector('p-datepicker-next');
    if (dateArowNext2) this.renderer.setAttribute(dateArowNext2, 'ariaLabel', 'לחודש הבא');
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    //הוספת קלאס של תהילה כיוון שאין אפשרות להוסיף לטבלה עצמה
    this.renderer.addClass(document.getElementsByTagName("table")[0], "table-bordered");
    this.setCurrencyLable();
    this.setPaginationAriaLabels();
    this.setCalendarAccessibilityBtn();
  }

  onCalendarShow() {
    setTimeout(() => {
      (document.getElementsByClassName('p-datepicker-prev')[0] as HTMLAnchorElement).setAttribute('aria-label', 'לחודש הקודם');
      (document.getElementsByClassName('p-datepicker-next')[0] as HTMLAnchorElement).setAttribute('aria-label', 'לחודש הבא');
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
