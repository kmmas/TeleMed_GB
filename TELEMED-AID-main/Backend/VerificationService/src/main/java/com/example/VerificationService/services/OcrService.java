package com.example.VerificationService.services;

import com.example.VerificationService.dto.InquiryResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class OcrService {

    @Value("${persona.secret-key}")
    private String personaSecretKey;

    @Value("${inquiry.template-id}")
    private String inquiryTemplateId;

    public ResponseEntity<?> createOcrInquiry () {
        OkHttpClient client = new OkHttpClient();
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,"{\"data\":{\"attributes\":{\"inquiry-template-id\":\"" + inquiryTemplateId + "\"}}}");
        Request request = new Request.Builder()
                .url("https://api.withpersona.com/api/v1/inquiries")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("Persona-Version", "2023-01-05")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + personaSecretKey)
                .build();

        try (Response response = client.newCall(request).execute()) {

            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(responseBody);

                String inquiryId = jsonNode.path("data").path("id").asText();
                String verificationLink = "https://inquiry.withpersona.com/verify?inquiry-id=" + inquiryId;

                System.out.println("Inquiry ID: " + inquiryId);
                System.out.println("Link: " + verificationLink);
                InquiryResponseDTO inquiryResponseDto = new InquiryResponseDTO(inquiryId, verificationLink);
                return ResponseEntity.ok(inquiryResponseDto);
            } else {
                return ResponseEntity
                        .status(response.code())
                        .body("Request failed: " + response.message());
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Internal server error occurred");
        }
    }

    public ResponseEntity<?> getInquiryState (String inquiryId) {

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://api.withpersona.com/api/v1/inquiries/" + inquiryId)
                .get()
                .addHeader("accept", "application/json")
                .addHeader("Persona-Version", "2023-01-05")
                .addHeader("authorization", "Bearer " + personaSecretKey)
                .build();

        try (Response response = client.newCall(request).execute()) { // Auto close

            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                String status = jsonNode.path("data").path("attributes").path("status").asText();

                System.out.println("Inquiry status: " + status);
                return ResponseEntity.ok(status);
            } else {
                return ResponseEntity
                        .status(response.code())
                        .body("Failed to get inquiry state: " + response.message());
            }

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Internal server error occurred");
        }

    }
}
