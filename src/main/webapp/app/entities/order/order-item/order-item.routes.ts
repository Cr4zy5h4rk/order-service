import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import OrderItemResolve from './route/order-item-routing-resolve.service';

const orderItemRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/order-item').then(m => m.OrderItem),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/order-item-detail').then(m => m.OrderItemDetail),
    resolve: {
      orderItem: OrderItemResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/order-item-update').then(m => m.OrderItemUpdate),
    resolve: {
      orderItem: OrderItemResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/order-item-update').then(m => m.OrderItemUpdate),
    resolve: {
      orderItem: OrderItemResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default orderItemRoute;
