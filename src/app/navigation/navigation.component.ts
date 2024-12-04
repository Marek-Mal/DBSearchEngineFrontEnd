import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-navigation',
  imports: [CommonModule, NgbDropdownModule, FormsModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  photoUrl:any = this.service.PhotoURL + 'Logo.jpg'
  isBasket:boolean = false
  isHome:boolean = false

  constructor(private service:SharedService, private router:Router) {
  }

  ngOnInit():void {
    if (this.router.url == '/') {
      this.isHome = true 
      this.isBasket = false
    } else {
      this.isBasket = true
      this.isHome = false
    }
  }

  clickBasket() {
    this.isBasket = true
    this.isHome = false
    this.router.navigateByUrl('Basket')
  }
  clickHome() {
    this.isHome = true
    this.isBasket = false
    this.router.navigateByUrl('')
  }
}
