import { Component, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from '../footer/footer.component';
import { PdfGenerationService } from '../pdf-generator.service';

interface Basket_Contents {
  CodeNumber: string
  Description: string
  Price: number
  Quantity: number
}

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule, NgbDropdownModule, FontAwesomeModule, FormsModule, FooterComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})


export class ShoppingListComponent {
  home_icon = faHome
  QuantityonShow:any
  CodeNumber:any
  Description:any
  Currency:any
  Price:any
  TrashIcon:any = faTrashCan
  isBrowser:boolean;
  basket_contents: Basket_Contents[] =[]
  quantity:any
  
  isUndefiend(x:any):any {
    if (x==undefined) return false 
    else return true
  }

  navigateToHome() {
    this.router.navigateByUrl('')
  }

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router, private modalService: NgbModal, private pdfService: PdfGenerationService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      for (let i=0; i<Object.keys(localStorage).length; i++) {
        let currentobj = JSON.parse(Object.values(localStorage)[i])
        let tempobj = {
          CodeNumber: currentobj.part_id,
          Description: currentobj.part_name,
          Price: currentobj.price,
          Quantity: currentobj.quantity
        }
        
        this.basket_contents = this.basket_contents.concat(tempobj)
      }
      // this.CodeNumber = localStorage.getItem('part_id');
      // this.Description = localStorage.getItem('part_name');
      // this.Price = localStorage.getItem('price');
      // this.Quantity = localStorage.getItem('quantity');
      
    } else {
      console.warn('localStorage is not available.');
    }
  }

  removeItem(data:any) {
    if (confirm(`Are You Sure You Want To Remove Item: ${data}`)){
      localStorage.removeItem(data)
      location.reload()
      
    }
  }

  trackByIndex(index: any): any {
    let tempobj2 = {
      'part_id': index.CodeNumber,
      'part_name': index.Description,
      'price': index.Price,
      'quantity': index.Quantity,
    }

    localStorage.removeItem(index.CodeNumber)
    localStorage.setItem(tempobj2.part_id, JSON.stringify(tempobj2));
  }

  BuyClick() {
    // localStorage.clear();
    this.router.navigateByUrl('')
  }

  ObjectsDeleted:any

  openSm(content: TemplateRef<any>) {
		this.modalService.open(content, { size: 'lg' });
    for (let i=0; i<Object.keys(localStorage).length; i++) {
      if (Object.keys(localStorage)[i] == undefined) {

      }else {
        this.ObjectsDeleted += Object.keys(localStorage)[i] + ', '
      }
    }
    this.ObjectsDeleted = this.ObjectsDeleted.replace('undefined', '')
    
	}

  tableData:any = [];
  ContactPerson: any
  ShipsName: any
  EngineType: any
  ReferenceNo: any
  OurReferenceNo: any
  DateOfArrival: any
  Transportation: any
  Adress: any
  Remarks: any
  InvolcingAddress: any
  valueAll:number =0

  generatePdf() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(String(key));
      if (key && value) {
        const parsedValue = JSON.parse(value);
        this.tableData.push([key, parsedValue.quantity, parsedValue.part_name, parsedValue.price, parsedValue.price * parsedValue.quantity, '2 days']);
        this.valueAll += parsedValue.price * parsedValue.quantity
      }
    }
    if (this.InvolcingAddress == undefined) this.InvolcingAddress =''
    const data = {
      quotationNumber: this.OurReferenceNo,
      date: '20.12.2024',
      deliveryTo: `Master of MV "${this.ShipsName}"
"Ship spares in transit" Attn: Service Engineer ${this.ContactPerson}
c/o ${this.InvolcingAddress}`,
      customerNumber: '4211611',
      payment: '60 days net',
      dateOfRFQ: '20.12.2024',
      validity: '30 days',
      inquiry: 'SPARE FOR REV. CYL',
      incoterms: 'DAP',
      object: this.EngineType,
      deliveryTime: 'mentioned, subject to prior sale',
      reference: 'Sanjita Saharan',
      transport: 'DHL EXPRESS',
      // netWeight: '3.74',
      valueOfGoods: this.valueAll,
      packingHandling: '10.00',
      freightFare: '134.00',
      totalAmount: this.valueAll + 10 + 134,
      tableData: this.tableData
    };

    // Retrieve data from local storage
    this.pdfService.generateQuotationPdf(data);
    this.BuyClick()
  }
}
