import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IOrderItem, NewOrderItem } from '../order-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrderItem for edit and NewOrderItemFormGroupInput for create.
 */
type OrderItemFormGroupInput = IOrderItem | PartialWithRequiredKeyOf<NewOrderItem>;

type OrderItemFormDefaults = Pick<NewOrderItem, 'id'>;

type OrderItemFormGroupContent = {
  id: FormControl<IOrderItem['id'] | NewOrderItem['id']>;
  productId: FormControl<IOrderItem['productId']>;
  quantity: FormControl<IOrderItem['quantity']>;
  unitPrice: FormControl<IOrderItem['unitPrice']>;
  order: FormControl<IOrderItem['order']>;
};

export type OrderItemFormGroup = FormGroup<OrderItemFormGroupContent>;

@Service()
export class OrderItemFormService {
  createOrderItemFormGroup(orderItem?: OrderItemFormGroupInput): OrderItemFormGroup {
    const orderItemRawValue = {
      ...this.getFormDefaults(),
      ...(orderItem ?? { id: null }),
    };

    return new FormGroup<OrderItemFormGroupContent>({
      id: new FormControl(
        { value: orderItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      productId: new FormControl(orderItemRawValue.productId, {
        validators: [Validators.required],
      }),
      quantity: new FormControl(orderItemRawValue.quantity, {
        validators: [Validators.required],
      }),
      unitPrice: new FormControl(orderItemRawValue.unitPrice, {
        validators: [Validators.required],
      }),
      order: new FormControl(orderItemRawValue.order),
    });
  }

  getOrderItem(form: OrderItemFormGroup): IOrderItem | NewOrderItem {
    return form.getRawValue();
  }

  resetForm(form: OrderItemFormGroup, orderItem: OrderItemFormGroupInput): void {
    const orderItemRawValue = { ...this.getFormDefaults(), ...orderItem };
    form.reset({
      ...orderItemRawValue,
      id: { value: orderItemRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): OrderItemFormDefaults {
    return {
      id: null,
    };
  }
}
