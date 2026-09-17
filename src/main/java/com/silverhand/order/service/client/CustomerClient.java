package com.silverhand.order.service.client;

import com.silverhand.order.service.DTO.CustomerDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer")
public interface CustomerClient {

    @GetMapping("/api/customers/{id}")
    CustomerDTO getCustomer(@PathVariable("id") Long id);
}
