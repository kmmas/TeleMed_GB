package telemid_aid.project.router.config;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.router.HeaderValueRouter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import telemid_aid.project.router.dto.UserRequest;
import telemid_aid.project.router.service.RouterService;

@Configuration
@EnableFeignClients(basePackages = "telemid_aid.project.router.config")
@EnableIntegration
@RequiredArgsConstructor
public class RouterConfig {

    private RouterService routerService;

    // Define channels
    @Bean
    public MessageChannel routerInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel patientServiceChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel doctorServiceChannel() {
        return new DirectChannel();
    }

    // Router configuration
    @Bean
    @ServiceActivator(inputChannel = "routerInputChannel")
    public HeaderValueRouter router() {
        HeaderValueRouter router = new HeaderValueRouter("role");
        router.setChannelMapping("PATIENT", "patientServiceChannel");
        router.setChannelMapping("DOCTOR", "doctorServiceChannel");
        return router;
    }

    // Patient service handler (would call patient service)
    @Bean
    @ServiceActivator(inputChannel = "patientServiceChannel")
    public MessageHandler patientServiceHandler(RouterService routerService) {
        return message -> {
            UserRequest userRequest = (UserRequest) message.getPayload();

            try {
                ResponseEntity<?> response = routerService.sendToPatient(userRequest);

                if (response.getStatusCode().is2xxSuccessful()) {
                    System.out.println("Successfully created patient: " + response.getBody());
                } else {
                    System.err.println("Failed to create patient: " + response.getBody());
                    throw new Exception("Patient service returned: " + response.getStatusCode());
                }
            } catch (Exception e) {
                System.err.println("Error calling patient service: " + e.getMessage());
                throw new MessagingException(message, "Failed to process patient request", e);
            }
        };
    }

    // Doctor service handler (would call doctor service)
    @Bean
    @ServiceActivator(inputChannel = "doctorServiceChannel")
    public MessageHandler doctorServiceHandler(RouterService routerService) {
        return message -> {
            UserRequest userRequest = (UserRequest) message.getPayload();

            try {
                ResponseEntity<?> response = routerService.sendToDoctor(userRequest);

                if (response.getStatusCode().is2xxSuccessful()) {
                    System.out.println("Successfully created doctor: " + response.getBody());
                } else {
                    System.err.println("Failed to create doctor: " + response.getBody());
                    throw new Exception("Patient service returned: " + response.getStatusCode());
                }
            } catch (Exception e) {
                System.err.println("Error calling doctor service: " + e.getMessage());
                throw new MessagingException(message, "Failed to process doctor request", e);
            }
        };
    }
}