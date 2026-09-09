import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, asapScheduler, catchError, map, scheduled } from 'rxjs';

import { microserviceContextPath, serverApiUrl } from 'app/config';
import { Search, createRequestOption } from 'app/core/request';
import { IOrder, NewOrder } from '../order.model';

export type PartialUpdateOrder = Partial<IOrder> & Pick<IOrder, 'id'>;

type RestOf<T extends IOrder | NewOrder> = Omit<T, 'orderDate'> & {
  orderDate?: string | null;
};

export type RestOrder = RestOf<IOrder>;

export type NewRestOrder = RestOf<NewOrder>;

export type PartialUpdateRestOrder = RestOf<PartialUpdateOrder>;

@Service()
export class OrdersService {
  readonly ordersParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly ordersResource = httpResource<RestOrder[]>(() => {
    const params = this.ordersParams();
    if (!params) {
      return undefined;
    }
    return { url: params.query ? this.resourceSearchUrl : this.resourceUrl, params };
  });
  /**
   * This signal holds the list of order that have been fetched. It is updated when the ordersResource emits a new value.
   * In case of error while fetching the orders, the signal is set to an empty array.
   */
  readonly orders = computed(() =>
    (this.ordersResource.hasValue() ? this.ordersResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}${microserviceContextPath}order/api/orders`;
  protected readonly resourceSearchUrl = `${serverApiUrl}${microserviceContextPath}order/api/orders/_search`;

  protected convertValueFromServer(restOrder: RestOrder): IOrder {
    return {
      ...restOrder,
      orderDate: restOrder.orderDate ? dayjs(restOrder.orderDate) : undefined,
    };
  }
}

@Service()
export class OrderService extends OrdersService {
  protected readonly http = inject(HttpClient);

  create(order: NewOrder): Observable<IOrder> {
    const copy = this.convertValueFromClient(order);
    return this.http.post<RestOrder>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(order: IOrder): Observable<IOrder> {
    const copy = this.convertValueFromClient(order);
    return this.http
      .put<RestOrder>(`${this.resourceUrl}/${encodeURIComponent(this.getOrderIdentifier(order))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(order: PartialUpdateOrder): Observable<IOrder> {
    const copy = this.convertValueFromClient(order);
    return this.http
      .patch<RestOrder>(`${this.resourceUrl}/${encodeURIComponent(this.getOrderIdentifier(order))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IOrder> {
    return this.http.get<RestOrder>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IOrder[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  search(req: Search): Observable<IOrder[]> {
    const options = createRequestOption(req);
    return this.http.get<RestOrder[]>(this.resourceSearchUrl, { params: options }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),
      catchError(() => scheduled([], asapScheduler)),
    );
  }

  getOrderIdentifier(order: Pick<IOrder, 'id'>): number {
    return order.id;
  }

  compareOrder(o1: Pick<IOrder, 'id'> | null, o2: Pick<IOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderIdentifier(o1) === this.getOrderIdentifier(o2) : o1 === o2;
  }

  addOrderToCollectionIfMissing<Type extends Pick<IOrder, 'id'>>(
    orderCollection: Type[],
    ...ordersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orders: Type[] = ordersToCheck.filter(orderItem => orderItem !== null && orderItem !== undefined);
    if (orders.length > 0) {
      const orderCollectionIdentifiers = orderCollection.map(orderItem => this.getOrderIdentifier(orderItem));
      const ordersToAdd = orders.filter(orderItem => {
        const orderIdentifier = this.getOrderIdentifier(orderItem);
        if (orderCollectionIdentifiers.includes(orderIdentifier)) {
          return false;
        }
        orderCollectionIdentifiers.push(orderIdentifier);
        return true;
      });
      return [...ordersToAdd, ...orderCollection];
    }
    return orderCollection;
  }

  protected convertValueFromClient<T extends IOrder | NewOrder | PartialUpdateOrder>(order: T): RestOf<T> {
    return {
      ...order,
      orderDate: order.orderDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestOrder): IOrder {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestOrder[]): IOrder[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
