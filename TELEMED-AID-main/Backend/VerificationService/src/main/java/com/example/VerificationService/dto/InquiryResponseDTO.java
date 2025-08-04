package com.example.VerificationService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InquiryResponseDTO {
    public String inquiryId;
    public String verificationLink;
}
