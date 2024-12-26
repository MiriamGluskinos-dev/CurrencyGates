import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SystemTable, SystemTableNameField } from '../models/SystemTable';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-system-table',
  templateUrl: './system-table.component.html',
  styleUrls: ['./system-table.component.scss', '../../styles.scss'], // Update your styling to SCSS if needed
  encapsulation: ViewEncapsulation.None, // For ::ng-deep
})
export class SystemTableComponent implements OnInit {
  title: string = 'הצגת טבלאות קהילתיות';
  descriptionLines: string[] = [
    'נותנת מענה לגורמים השונים בשרשרת הסחר בדבר נתונים החסרים להם לשם המשך עבודתם, וכן משמשת את הציבור הרחב לטובת פעילותו המכסית.',
    'הנתונים מוצגים בצורה מובנת של טבלאות קוד ממערכת שער עולמי. הנתונים ניתנים לחשיפה לכלל הציבור ללא צורך בזיהוי השואל.',
    'הנתונים מתעדכנים אחת ל 24 שעות.',
  ];

  currentIndex: number = 0;
  gridData: any;
  tables: any[] = [];
  filterTables: any[] = [];
  selectedtablesTypeList: any;
  columns: any[] = [];
  idList: any[] = [];
  selectedID: any;
  flag: boolean = false;
  param: string = 'TableConfiguration';
  tablesList: SystemTable[] = [];
  flagPaginator: boolean = false;
  tableWithHebrewFieldName: SystemTableNameField[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const url = `/shaarolami/CustomspilotWeb/SystemTables/api/GetTableData?tableName=${this.param}`;
    this.callService(url).subscribe({
      next: (response) => this.onSuccessTables(response),
      error: (error) => console.error('Error fetching table data:', error),
    });
  }

  get selectedtablesTypeListString(): string {
    if (!this.selectedtablesTypeList) return '';
    return typeof this.selectedtablesTypeList === 'string'
      ? this.selectedtablesTypeList.toLowerCase()
      : this.selectedtablesTypeList.displayText.toLowerCase();
  }

  get selectedKey(): string {
    return this.selectedtablesTypeList?.key?.toLowerCase() || '';
  }

  get selectedIdd(): string {
    return this.selectedID?.toLowerCase() || '';
  }

  private onSuccessTables(data: any): void {
    this.tablesList = data.map(
      (r: any) =>
        new SystemTable(r.ID, r.MalamId, r.Name, r.State, r.ExtraStringData)
    );
  }

  private onSuccess(data: any, tableID: number): void {
    this.tableWithHebrewFieldName = data['ColumnsCaption'].reduce(
      (acc: SystemTableNameField[], r: any) => {
        if (
          !(
            (tableID === 1964 && r.Name === 'ID') ||
            (tableID === 2050 && r.Name === 'ID') ||
            (tableID === 239688 && r.Name === 'ExternalIdNum')
          )
        ) {
          acc.push(new SystemTableNameField(r.Name, r.Description));
        }
        return acc;
      },
      []
    );

    this.columns = this.tableWithHebrewFieldName;
    this.gridData = Object.values(data)[0];
  }

  private callService(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  initSystemTablesList(list: SystemTable[]) {
    this.filterTables = list.filter((elem, index, self) => index === self.findIndex(i => i.ExtraStringData == elem.ExtraStringData));

  }

  filterTablesType(): void {
    const pattern = this.selectedtablesTypeListString;
    this.filterTables = this.tablesList
      .filter(
        (r) =>
          !pattern ||
          r.displayText.toLowerCase().includes(pattern)
      )
      .sort((a, b) => {
        const aIndex = a.displayText.toLowerCase().indexOf(pattern);
        const bIndex = b.displayText.toLowerCase().indexOf(pattern);
        return aIndex - bIndex;
      });
  }

  searchData(): void {
    this.flagPaginator = true;
    this.columns = this.selectedtablesTypeList?.columns || [];
    const url = `/shaarolami/CustomspilotWeb/SystemTables/api/GetTableData?tableName=${this.selectedtablesTypeList.Name}&includeMetadata=true`;
    this.callService(url).subscribe({
      next: (response) =>
        this.onSuccess(response, this.selectedtablesTypeList.ID),
      error: (error) => console.error('Error fetching search data:', error),
    });
    this.resetPaging();
  }

  @ViewChild('dt') table!: Table;

  resetPaging(): void {
    this.currentIndex = 0;
    this.table.reset();
  }
}
