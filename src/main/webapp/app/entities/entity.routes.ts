import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'order',
    title: 'orderApp.orderOrder.home.title',
    loadChildren: () => import('./order/order/order.routes'),
  },
  {
    path: 'order-item',
    title: 'orderApp.orderOrderItem.home.title',
    loadChildren: () => import('./order/order-item/order-item.routes'),
  },
  // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
];

export default routes;
