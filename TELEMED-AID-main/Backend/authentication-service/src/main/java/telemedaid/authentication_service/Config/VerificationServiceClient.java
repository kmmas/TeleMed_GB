package telemedaid.authentication_service.Config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
@FeignClient(name = "VerificationService", url = "http://localhost:8084")
public interface VerificationServiceClient {

    @GetMapping("/ocr/ocr-inquiry")
    ResponseEntity<?> createOcrInquiry();

    @GetMapping("/ocr/inquiry-state")
    String inquiryState(@RequestParam("inquiryId") String inquiryId);
}