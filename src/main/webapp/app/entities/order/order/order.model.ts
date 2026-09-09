import dayjs from 'dayjs/esm';

import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface IOrder {
  id: number;
  orderDate?: dayjs.Dayjs | null;
  status?: keyof typeof OrderStatus | null;
  customerId?: number | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
