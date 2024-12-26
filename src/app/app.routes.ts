import { Routes } from '@angular/router';
import { SystemTableComponent } from './system-table/system-table.component';

export const rootRouterConfig: Routes = [
    { path: 'systemTable', component: SystemTableComponent, pathMatch:'full' },
];
