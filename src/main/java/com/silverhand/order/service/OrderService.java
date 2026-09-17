package com.silverhand.order.service;

import com.silverhand.order.service.client.CatalogClient;
import com.silverhand.order.service.client.CustomerClient;

import com.silverhand.order.domain.Order;
import com.silverhand.order.domain.OrderItem;
import com.silverhand.order.repository.OrderRepository;
import com.silverhand.order.repository.search.OrderSearchRepository;
import com.silverhand.order.service.DTO.CustomerDTO;
import com.silverhand.order.service.DTO.ProductDTO;
import com.silverhand.order.service.exceptions.CustomerNotFoundException;
import com.silverhand.order.service.exceptions.InsufficientStockException;
import com.silverhand.order.service.exceptions.ProductNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private static final Logger LOG = LoggerFactory.getLogger(OrderService.class);
    private static final String ENTITY_NAME = "orderOrder";

    private final OrderRepository orderRepository;
    private final OrderSearchRepository orderSearchRepository;
    private final CatalogClient catalogClient;
    private final CustomerClient customerClient;

    public OrderService(
        OrderRepository orderRepository,
        OrderSearchRepository orderSearchRepository,
        CatalogClient catalogClient,
        CustomerClient customerClient
    ) {
        this.orderRepository = orderRepository;
        this.orderSearchRepository = orderSearchRepository;
        this.catalogClient = catalogClient;
        this.customerClient = customerClient;
    }

    public Order createOrder(Order order) {
        CustomerDTO customer = customerClient.getCustomer(order.getCustomerId());
        if (customer == null) {
            throw new CustomerNotFoundException(order.getCustomerId());
        }

        for (OrderItem item : order.getOrderItems()) {
            ProductDTO product = catalogClient.getProduct(item.getProductId());
            if (product == null) {
                throw new ProductNotFoundException(item.getProductId());
            }
            if (product.getStock() < item.getQuantity()) {
                throw new InsufficientStockException(product.getName());
            }
            item.setUnitPrice(product.getPrice());
        }

        LOG.debug("Validation OK, saving order for customer {}", order.getCustomerId());
        order = orderRepository.save(order);
        orderSearchRepository.index(order);
        return order;
    }
}
