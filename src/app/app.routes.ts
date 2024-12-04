import { Routes } from '@angular/router';
import { SearchMainComponent } from './search-main/search-main.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

export const routes: Routes = [
    { path: '', component:SearchMainComponent },
    { path: 'Basket', component:ShoppingListComponent },
];
