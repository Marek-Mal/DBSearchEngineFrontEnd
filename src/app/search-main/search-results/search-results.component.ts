import { Component, Input, TemplateRef } from '@angular/core';
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Base64 } from 'js-base64';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

interface Component_Contents {
  id:string;
  component_name:string;
  pdf_page:number;
  engine:string;
  image:string;
}

interface spare_parts_contents {
  part_name: string;
  pdf_page: number;
  component_id: string;
  price: string;
  part_id: string;
  extras: string;
  isAvalable:string;
}

@Component({
  selector: 'app-search-results',
  imports: [NgbAccordionModule, CommonModule, NgbPaginationModule, FontAwesomeModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  constructor(private service:SharedService, private modalService:NgbModal, private router:Router) { }


  @Input() searchTerm:any
  @Input() isEngine:any
  @Input() cID:any
  buy_icon:any = faShoppingCart
  items:any
  spare_parts_items:any;
  component_contents: Component_Contents[] =[]
  Spare_Parts_Contents: spare_parts_contents[] = []
  photo_url:any = this.service.PhotoURL
  page = 1;
	pageSize = 10;
	collectionSize:any
  pagination:any
  encoded_data:any
  currentImage:any
  object:any

  
  engine_filter_true: any = false
  decoded_data:any
  
  ngOnInit(): void {
    this.refreshData()
    this.refreshSpare_Parts()
  }

  // gain subscribed date from server to show newest results 
  refreshData() {
    this.decoded_data = Base64.decode(this.searchTerm)
    if(Number(this.decoded_data[0]) >=0) {
      this.service.get_engine_filter(this.searchTerm).subscribe(data => {
        this.pagination = data.length
        this.component_contents = data;
        this.items = data
        this.items.image = this.service.APIUrl+this.items.image
        this.engine_filter_true = true
      })
    } else {
      this.encoded_data = Base64.encode(this.cID)
      this.service.get_engine_filter(this.encoded_data).subscribe(data => {
        this.pagination = data.length
        this.component_contents = data;
        this.items = data
        
      })
    }
    
  }

  // gain subscribed date from server to show newest results 
  refreshSpare_Parts() {
    if (this.isEngine) {
      this.encoded_data = Base64.encode(this.cID)
      this.service.get_spare_parts_filter_by_engineID(this.encoded_data).subscribe(data => {
        this.collectionSize = data.length
        this.Spare_Parts_Contents = data
      })
    } 
    else {
      this.service.get_spare_parts().subscribe(data => {
        this.collectionSize = data.length
        this.Spare_Parts_Contents = data;
      })
    }
  }

  openSm(content: TemplateRef<any>) {
		this.modalService.open(content, { size: 'sm' });
	}

  openBasket() {
    this.router.navigateByUrl('Basket')
  }

  addToStorage(data:any) {
    if (Object.keys(localStorage).length > 0) {
      for (let i=0;i <= Number(Object.keys(localStorage.length)) +1; i++) {      
        if (Object.keys(localStorage)[i] == data.part_id) {

        } else{
          this.object = {
            // 'component_id': data.component_id,
            // 'extras': data.extras,
            'part_id': data.part_id,
            'part_name': data.part_name,
            'price': data.price,
            'quantity': '1',
          }
          localStorage.setItem(data.part_id, JSON.stringify(this.object));
        }
      }
    } else {
      this.object = {
        'component_id': data.component_id,
        'extras': data.extras,
        'part_id': data.part_id,
        'part_name': data.part_name,
        'price': data.price,
        'quantity': '1',
      }
      localStorage.setItem(data.part_id, JSON.stringify(this.object));
    }
  
  }

  openXl(content: TemplateRef<any>, image:any) {
		this.modalService.open(content, { size: 'lg' });
    this.currentImage = this.service.APIUrl + image
	}

}
