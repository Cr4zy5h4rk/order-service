package com.silverhand.order.service;

import com.silverhand.order.client.CatalogClient;
import com.silverhand.order.client.CustomerClient;

import com.silverhand.order.domain.Order;
import com.silverhand.order.domain.OrderItem;
import com.silverhand.order.repository.OrderRepository;
import com.silverhand.order.repository.search.OrderSearchRepository;
import com.silverhand.order.service.DTO.CustomerDTO;
import com.silverhand.order.service.DTO.ProductDTO;
import com.silverhand.order.web.rest.errors.BadRequestAlertException;
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
        // 1. Valider que le client existe
        CustomerDTO customer = customerClient.getCustomer(order.getCustomerId());
        if (customer == null) {
            throw new BadRequestAlertException("Customer not found", ENTITY_NAME, "customernotfound");
        }

        // 2. Valider chaque produit et vérifier le stock
        for (OrderItem item : order.getOrderItems()) {
            ProductDTO product = catalogClient.getProduct(item.getProductId());
            if (product == null) {
                throw new BadRequestAlertException("Product not found: " + item.getProductId(), ENTITY_NAME, "productnotfound");
            }
            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestAlertException("Insufficient stock for product: " + product.getName(), ENTITY_NAME, "insufficientstock");
            }
            // Optionnel : fixer le prix unitaire depuis catalog plutôt que de faire confiance au client
            item.setUnitPrice(product.getPrice());
        }

        LOG.debug("Validation OK, saving order for customer {}", order.getCustomerId());

        // 3. Sauvegarder et indexer
        order = orderRepository.save(order);
        orderSearchRepository.index(order);
        return order;
    }
}
