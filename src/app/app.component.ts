import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ServService} from '../app/serv.service';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'productName',
    'productPrice'
  ];
  title = 'autocomplete';
  options = [];
  filteredOptions;
  displayTable;
  formGroup: FormGroup;
  height: string;
  selectedProductName: string;
  quantityEntered: number;
  productPrice: any;
  productDetails: any;
  totalProductPrice: number;
  dataSource;
  productsForOrder: any;
  orderedProductPrice: number;
  orderForm: boolean;
  myPriceListArray = new Array();
  mySelectedProductList = new Array();
  formSubmitted: boolean;

  constructor(private service: ServService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.initForm();
    this.getNames();
    this.service.getAllData().subscribe(response => {
      console.log(response);
    });
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      productNames : [''],
      quantity: ''
    });
    this.formGroup.get('productNames').valueChanges
      .pipe(debounceTime(1000)).subscribe(response => {
      console.log('data is ', response);
      this.filterData(response);
    });
    this.formGroup.get('quantity').valueChanges.subscribe(res => {
      this.quantityEntered = res;
    });
  }

  filterData(enteredData): void{
    this.filteredOptions = this.options.filter(item => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1;
    });
    console.log(this.filteredOptions);
    // Recompute how big the viewport should be.
    if (this.filteredOptions.length < 4) {
      this.height = (this.filteredOptions.length * 50) + 'px';
    } else {
      this.height = '200px';
    }
  }

  getNames(): void{
    this.service.getNameData().subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    this.selectedProductName = this.formGroup.get('productNames').value;
    this.findProductDetails(this.selectedProductName);
  }

  findProductDetails(selectedProduct): void {
    this.service.getAllData().subscribe(response => {
      response.map((item, index) => {
        if (Object.values(item).includes(selectedProduct)) {
          this.productDetails = item;
          console.log(this.productDetails);
          this.productPrice = this.productDetails.productPrice;
          this.totalProductPrice = this.quantityEntered * this.productPrice;
          this.mySelectedProductList.push(selectedProduct);
          console.log(this.mySelectedProductList);
          this.myPriceListArray.push(this.totalProductPrice);
          console.log(this.myPriceListArray);
        }
      });
    });
  }

  OrderForm(): void {
    this.orderForm = true;
    this.orderedProductPrice = this.myPriceListArray.reduce((prod1, prod2) => prod1 + prod2);
    console.log(this.orderedProductPrice);
  }
}
