package com.example.VerificationService.controller;

import com.example.VerificationService.services.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/ocr")
public class OcrController {

    @Autowired
    public OcrService ocrService;

    @GetMapping("/ocr-inquiry")
    public ResponseEntity<?> createOcrInquiry() {
        return  ocrService.createOcrInquiry();
    }
    @GetMapping("/inquiry-state")
    public ResponseEntity<?> inquiryState(@RequestParam String inquiryId) {
        return ocrService.getInquiryState(inquiryId);
    }
}
