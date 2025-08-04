package telemedaid.authentication_service.Config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import telemedaid.authentication_service.DTOs.CreateDoctorRequest;
@FeignClient(name = "doctor-service", url = "http://localhost:8082")
public interface DoctorServiceClient {
    @PostMapping("/api/doctor")
    ResponseEntity<String> addDoctor(@RequestBody CreateDoctorRequest request);
}
