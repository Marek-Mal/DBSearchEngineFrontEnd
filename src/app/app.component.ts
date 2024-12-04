import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchMainComponent } from './search-main/search-main.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Database of Spares for Marine Disel Engines';
}
