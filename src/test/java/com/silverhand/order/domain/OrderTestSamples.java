package com.silverhand.order.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class OrderTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Order getOrderSample1() {
        return new Order().id(1L).customerId(1L);
    }

    public static Order getOrderSample2() {
        return new Order().id(2L).customerId(2L);
    }

    public static Order getOrderRandomSampleGenerator() {
        return new Order().id(longCount.incrementAndGet()).customerId(longCount.incrementAndGet());
    }
}
