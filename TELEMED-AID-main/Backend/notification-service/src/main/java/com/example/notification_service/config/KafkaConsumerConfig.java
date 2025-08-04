package com.example.notification_service.config;
import org.apache.kafka.common.TopicPartition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public DeadLetterPublishingRecoverer recoverer(KafkaTemplate<Object, Object> template) {
        return new DeadLetterPublishingRecoverer(template,
                (r, e) -> new TopicPartition(r.topic() + ".DLQ", r.partition()));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory(
            ConsumerFactory<String, String> consumerFactory,
            DeadLetterPublishingRecoverer recoverer) {

        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        // 1. Set the consumer factory
        factory.setConsumerFactory(consumerFactory);

        // 2. Configure error handling with the injected recoverer
        factory.setCommonErrorHandler(
                new DefaultErrorHandler(
                        recoverer,  // Use the provided DeadLetterPublishingRecoverer
                        new FixedBackOff(1000L, 3)  // 1-second delay between 3 retries
                )
        );

        return factory;
    }
}
