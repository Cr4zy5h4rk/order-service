package com.silverhand.order;

import com.silverhand.order.config.AsyncSyncConfiguration;
import com.silverhand.order.config.DatabaseTestcontainer;
import com.silverhand.order.config.ElasticsearchTestConfiguration;
import com.silverhand.order.config.ElasticsearchTestContainer;
import com.silverhand.order.config.RedisTestContainer;
import com.silverhand.order.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    classes = {
        OrderApp.class,
        AsyncSyncConfiguration.class,
        TestSecurityConfiguration.class,
        com.silverhand.order.config.JacksonHibernateConfiguration.class,
        DatabaseTestcontainer.class,
        ElasticsearchTestContainer.class,
        ElasticsearchTestConfiguration.class,
        RedisTestContainer.class,
    }
)
public @interface IntegrationTest {}
