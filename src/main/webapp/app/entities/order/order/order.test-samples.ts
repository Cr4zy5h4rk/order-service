import dayjs from 'dayjs/esm';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 26110,
  orderDate: dayjs('2026-09-08T04:49'),
  status: 'CONFIRMED',
  customerId: 2491,
};

export const sampleWithPartialData: IOrder = {
  id: 19840,
  orderDate: dayjs('2026-09-08T04:17'),
  status: 'PENDING',
  customerId: 8286,
};

export const sampleWithFullData: IOrder = {
  id: 27813,
  orderDate: dayjs('2026-09-08T00:04'),
  status: 'PENDING',
  customerId: 3768,
};

export const sampleWithNewData: NewOrder = {
  orderDate: dayjs('2026-09-07T22:31'),
  status: 'SHIPPED',
  customerId: 2532,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
