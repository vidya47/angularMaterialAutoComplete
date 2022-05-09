import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServService {

  constructor(private http: HttpClient) { }

  getNameData(){
    return this.http.get('http://localhost:3000/order/products')
      .pipe(
        map((response:[]) => response.map(item => item['productName']))
      );
  }

  getAllData() {
    return this.http.get('http://localhost:3000/order/products').pipe(map((res:[]) => res.map(item => item)));
  }
}
