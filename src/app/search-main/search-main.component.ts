import { Component } from '@angular/core';
import { SearchResultsComponent } from './search-results/search-results.component';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { Base64 } from 'js-base64';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-search-main',
  imports: [SearchResultsComponent, FormsModule, CommonModule, FontAwesomeModule, FooterComponent],
  templateUrl: './search-main.component.html',
  styleUrl: './search-main.component.css'
})
export class SearchMainComponent {
  buy_icon = faShoppingCart
  searchTerm:string = ''
  searchQuery:string = ''
  isTrue:boolean = false
  isEngine:boolean = false
  component_id:any

  constructor(private service:SharedService, private router:Router) {}

  ngOnInit(){

  }

  searchWeb(term:any):void {
    this.isTrue = false
    this.isEngine = false
    term = term.toUpperCase()
    this.searchQuery = term
    if (term === '') return;
    if(this.searchQuery.startsWith('D')){
    
      if (this.searchQuery.startsWith('D ')){}
      else {
        term = term.replace('D', 'D ')
      }
  
      this.service.get_spare_parts_filter(term).subscribe((data:any) => {
        if (term != data[0].part_id || term == data[0].part_id.replace(/\s/g, '')) {
        }
        else {
          this.isTrue = true
          this.isEngine = true
          this.component_id = data[0].component_id
        }
        this.searchQuery = term
      })
    } if(Number(this.searchQuery[0]) >=0) {
      this.searchQuery = Base64.encode(term)
      this.service.get_engine_filter(this.searchQuery).subscribe((data:any) => {
        this.isTrue = true
      })
    }
    }

    navigateToBasket() {
      this.router.navigateByUrl('Basket')
    }

}
