import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import OrderResolve from './route/order-routing-resolve.service';

const orderRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/order').then(m => m.Order),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/order-detail').then(m => m.OrderDetail),
    resolve: {
      order: OrderResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/order-update').then(m => m.OrderUpdate),
    resolve: {
      order: OrderResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/order-update').then(m => m.OrderUpdate),
    resolve: {
      order: OrderResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default orderRoute;
