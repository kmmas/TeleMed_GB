package telemid_aid.project.router.service;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Service;
import telemid_aid.project.router.config.DoctorServiceClient;
import telemid_aid.project.router.config.PatientServiceClient;
import telemid_aid.project.router.dto.UserRequest;

@Service
@RequiredArgsConstructor
public class RouterService {

    private final MessageChannel routerInputChannel;
    private final PatientServiceClient patientServiceClient;
    private final DoctorServiceClient doctorServiceClient;
    public void routeUserData(UserRequest userData) {
        Message<UserRequest> message = MessageBuilder.withPayload(userData)
                .setHeader("role", userData.getRole())
                .build();
        System.out.println("message: " + message);
        routerInputChannel.send(message);
    }

    public ResponseEntity<?> sendToPatient(UserRequest userRequest) {
        try {
            ResponseEntity<String> response = patientServiceClient.createPatient(userRequest);
            return ResponseEntity.status(response.getStatusCode())
                    .body(response.getBody());
        } catch (FeignException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calling patient service: " + e.getMessage());
        }
    }

    public ResponseEntity<?> sendToDoctor(UserRequest userRequest) {
        try {
            ResponseEntity<String> response = doctorServiceClient.createDoctor(userRequest);
            return ResponseEntity.status(response.getStatusCode())
                    .body(response.getBody());
        } catch (FeignException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calling doctor service: " + e.getMessage());
        }
    }
}