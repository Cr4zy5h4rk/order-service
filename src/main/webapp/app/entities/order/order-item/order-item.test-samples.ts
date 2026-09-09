import { IOrderItem, NewOrderItem } from './order-item.model';

export const sampleWithRequiredData: IOrderItem = {
  id: 16549,
  productId: 23987,
  quantity: 22507,
  unitPrice: 12961.94,
};

export const sampleWithPartialData: IOrderItem = {
  id: 28487,
  productId: 27299,
  quantity: 22463,
  unitPrice: 24133.36,
};

export const sampleWithFullData: IOrderItem = {
  id: 6728,
  productId: 17449,
  quantity: 20264,
  unitPrice: 10948.34,
};

export const sampleWithNewData: NewOrderItem = {
  productId: 12164,
  quantity: 1027,
  unitPrice: 12468.3,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
