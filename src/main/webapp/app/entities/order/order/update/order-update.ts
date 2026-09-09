import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize } from 'rxjs';

import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';

import { OrderFormGroup, OrderFormService } from './order-form.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class OrderUpdate implements OnInit {
  readonly isSaving = signal(false);
  order: IOrder | null = null;
  orderStatusValues = Object.keys(OrderStatus);

  protected orderService = inject(OrderService);
  protected orderFormService = inject(OrderFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderFormGroup = this.orderFormService.createOrderFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      if (order) {
        this.updateForm(order);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const order = this.orderFormService.getOrder(this.editForm);
    if (order.id === null) {
      this.subscribeToSaveResponse(this.orderService.create(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.update(order));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IOrder | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(order: IOrder): void {
    this.order = order;
    this.orderFormService.resetForm(this.editForm, order);
  }
}
