import { Component, Directive, ElementRef, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './services/config.service';

@Directive({
  selector: "[appHtmlreaderHeader]"
})
export class HtmlreaderDirectiveHeader {
  headerUrl: any;
  private data: any;
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    http: HttpClient,
    private configService: ConfigService
  ) {
    this.headerUrl = this.configService.getConfiguration().headerUrl;
    http.get(this.headerUrl, { responseType: "text" }).subscribe(res => {
      this.data = res;
      renderer.setProperty(el.nativeElement, "innerHTML", this.data);
    });
  }
}


@Directive({
  selector: "[appHtmlreaderFooter]"
})
export class HtmlreaderDirectiveFooter {
  footerUrl: any;
  private data: any;
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    http: HttpClient,
    private configService: ConfigService
  ) {
    this.footerUrl = this.configService.getConfiguration().footerUrl;
    http.get(this.footerUrl, { responseType: "text" }).subscribe(res => {
      this.data = res;
      renderer.setProperty(el.nativeElement, "innerHTML", this.data);
    });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', '../style_angular_18.css'],
})
export class AppComponent {

  title: string = '';
  descriptionLines: string[] = [];

  constructor(private titleService: Title) { }

  onActivate(event: any) {
    this.title = event.title;
    this.descriptionLines = event.descriptionLines;
    this.titleService.setTitle(event.title == undefined ? 'רשות המסים בישראל' : event.title);

  }
}
