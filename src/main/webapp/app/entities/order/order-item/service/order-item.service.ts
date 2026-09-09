import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import { Observable, asapScheduler, catchError, scheduled } from 'rxjs';

import { microserviceContextPath, serverApiUrl } from 'app/config';
import { Search, createRequestOption } from 'app/core/request';
import { IOrderItem, NewOrderItem } from '../order-item.model';

export type PartialUpdateOrderItem = Partial<IOrderItem> & Pick<IOrderItem, 'id'>;

@Service()
export class OrderItemsService {
  readonly orderItemsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly orderItemsResource = httpResource<IOrderItem[]>(() => {
    const params = this.orderItemsParams();
    if (!params) {
      return undefined;
    }
    return { url: params.query ? this.resourceSearchUrl : this.resourceUrl, params };
  });
  /**
   * This signal holds the list of orderItem that have been fetched. It is updated when the orderItemsResource emits a new value.
   * In case of error while fetching the orderItems, the signal is set to an empty array.
   */
  readonly orderItems = computed(() => (this.orderItemsResource.hasValue() ? this.orderItemsResource.value() : []));
  protected readonly resourceUrl = `${serverApiUrl}${microserviceContextPath}order/api/order-items`;
  protected readonly resourceSearchUrl = `${serverApiUrl}${microserviceContextPath}order/api/order-items/_search`;
}

@Service()
export class OrderItemService extends OrderItemsService {
  protected readonly http = inject(HttpClient);

  create(orderItem: NewOrderItem): Observable<IOrderItem> {
    return this.http.post<IOrderItem>(this.resourceUrl, orderItem);
  }

  update(orderItem: IOrderItem): Observable<IOrderItem> {
    return this.http.put<IOrderItem>(`${this.resourceUrl}/${encodeURIComponent(this.getOrderItemIdentifier(orderItem))}`, orderItem);
  }

  partialUpdate(orderItem: PartialUpdateOrderItem): Observable<IOrderItem> {
    return this.http.patch<IOrderItem>(`${this.resourceUrl}/${encodeURIComponent(this.getOrderItemIdentifier(orderItem))}`, orderItem);
  }

  find(id: number): Observable<IOrderItem> {
    return this.http.get<IOrderItem>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IOrderItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<IOrderItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  search(req: Search): Observable<IOrderItem[]> {
    const options = createRequestOption(req);
    return this.http.get<IOrderItem[]>(this.resourceSearchUrl, { params: options }).pipe(catchError(() => scheduled([], asapScheduler)));
  }

  getOrderItemIdentifier(orderItem: Pick<IOrderItem, 'id'>): number {
    return orderItem.id;
  }

  compareOrderItem(o1: Pick<IOrderItem, 'id'> | null, o2: Pick<IOrderItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderItemIdentifier(o1) === this.getOrderItemIdentifier(o2) : o1 === o2;
  }

  addOrderItemToCollectionIfMissing<Type extends Pick<IOrderItem, 'id'>>(
    orderItemCollection: Type[],
    ...orderItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orderItems: Type[] = orderItemsToCheck.filter(orderItemItem => orderItemItem !== null && orderItemItem !== undefined);
    if (orderItems.length > 0) {
      const orderItemCollectionIdentifiers = orderItemCollection.map(orderItemItem => this.getOrderItemIdentifier(orderItemItem));
      const orderItemsToAdd = orderItems.filter(orderItemItem => {
        const orderItemIdentifier = this.getOrderItemIdentifier(orderItemItem);
        if (orderItemCollectionIdentifiers.includes(orderItemIdentifier)) {
          return false;
        }
        orderItemCollectionIdentifiers.push(orderItemIdentifier);
        return true;
      });
      return [...orderItemsToAdd, ...orderItemCollection];
    }
    return orderItemCollection;
  }
}
