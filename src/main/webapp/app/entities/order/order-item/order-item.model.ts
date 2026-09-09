import { IOrder } from 'app/entities/order/order/order.model';

export interface IOrderItem {
  id: number;
  productId?: number | null;
  quantity?: number | null;
  unitPrice?: number | null;
  order?: IOrder | null;
}

export type NewOrderItem = Omit<IOrderItem, 'id'> & { id: null };
