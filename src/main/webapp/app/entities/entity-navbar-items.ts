import NavbarItem from 'app/layouts/navbar/navbar-item.model';

const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Order',
    route: '/order/order',
    translationKey: 'global.menu.entities.orderOrder',
  },
  {
    name: 'OrderItem',
    route: '/order/order-item',
    translationKey: 'global.menu.entities.orderOrderItem',
  },
  // jhipster-needle-add-entity-navbar - JHipster will add entity navbar items here
];

export default EntityNavbarItems;
