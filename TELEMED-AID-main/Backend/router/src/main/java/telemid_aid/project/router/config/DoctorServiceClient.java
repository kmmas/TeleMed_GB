package telemid_aid.project.router.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import telemid_aid.project.router.dto.UserRequest;

@FeignClient(name = "doctor-service", url = "${doctor.service.url}")
public interface DoctorServiceClient {
    @PostMapping("/api/doctor")
    ResponseEntity<String> createDoctor(@RequestBody UserRequest request);
}