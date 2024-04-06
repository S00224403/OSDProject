import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../order';
import { OrderService } from '../../services/order.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {
  //orders$: Observable<Order[]>;//orders observable
  cols: number = 1;//number of columns for grid list
  dataSource = new MatTableDataSource<Order>();//data source for table
  orders : Order[] = [];//orders array
  displayedColumns: string[] = ['Customer Name', 'Order Date', 'Total Order Price', 'Action']
  constructor(private orderService: OrderService, private breakpointObserver: BreakpointObserver) {
    this.orderService.getOrders().subscribe((orders: Order[]) => {
      
      this.orders = orders;
      console.log(this.orders);
      this.dataSource = new MatTableDataSource<Order>(this.orders);
      console.log(this.dataSource);
    });
    
  }
  //testing responsive design
  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.cols = 1;
      }
      if (result.breakpoints[Breakpoints.Small]) {
        this.cols = 2;
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        this.cols = 3;
      }
      if (result.breakpoints[Breakpoints.Large]) {
        this.cols = 4;
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        this.cols = 5; // Adjust the number of columns for XL screens
      }
    });
  }
  totalPrice(order: Order): number {
    let total: number = 0;
    order.products.forEach(product => {
      total += product.price * product.quantity;
    });
    return total;
  }
}
