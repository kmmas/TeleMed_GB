package telemedaid.authentication_service.Services;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import telemedaid.authentication_service.Config.DoctorServiceClient;
import telemedaid.authentication_service.Config.PatientServiceClient;
import telemedaid.authentication_service.Config.RouterGateway;
import telemedaid.authentication_service.Config.VerificationServiceClient;
import telemedaid.authentication_service.DTOs.*;
import telemedaid.authentication_service.Entities.Role;
import telemedaid.authentication_service.Entities.User;
import telemedaid.authentication_service.Exceptions.*;
import telemedaid.authentication_service.Repositories.UserRepository;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements RouterGateway {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final VerificationServiceClient verificationServiceClient;
    private final RouterGateway routerGateway;

    /**
     * GUA_UA_U1
     **/
    public AuthResponse registerPatient(RegisterPatientRequest request) {
        if (nationalIdExists(request.getNationalId())) {
            throw new UserAlreadyExistsException("National ID " + request.getNationalId() + " is already registered");
        }
        try {
            User user = User.builder()
                    .nationalId(request.getNationalId())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.valueOf("PATIENT"))
                    .createdAt(new Date())
                    .build();
            System.out.println("before validation");
            validateInquiryStatus(request.getInquiryId());
            System.out.println("after validation");
            userRepository.save(user);
            System.out.println("after saving user");
            CreatePatientRequest patientRequest = CreatePatientRequest.builder()
                    .userId(user.getId())
                    .name(request.getName())
                    .countryName(request.getCountryName())
                    .countryId(request.getCountryId())
                    .phone(request.getPhone())
                    .gender(request.getGender())
                    .birthDate(request.getDateOfBirth())
                    .role(user.getRole())
                    .build();
            routeUserData(patientRequest);
            /*patientServiceClient.createPatient(patientRequest);*/ /* Feign client to patient-service*/

            return AuthResponse.builder()
                    .token("Patient registered successfully")
                    .build();

        } catch (IdentityVerificationException e) {
            throw new IdentityVerificationException("National ID verification failed: " + e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage()+e);
            throw new RuntimeException("Failed to register"+e.getMessage());
        }
    }

    public AuthResponse registerDoctor(RegisterDoctorRequest request) {
        if (nationalIdExists(request.getNationalId())) {
            throw new UserAlreadyExistsException("National ID " + request.getNationalId() + " is already registered");
        }

        try {
            User user = User.builder()
                    .nationalId(request.getNationalId())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.valueOf("DOCTOR"))
                    .createdAt(new Date())
                    .build();

            validateInquiryStatus(request.getInquiryId());

            userRepository.save(user);
            CreateDoctorRequest createDoctorRequest = CreateDoctorRequest.builder()
                    .userId(user.getId())
                    .name(request.getName())
                    .birthDate(request.getDateOfBirth())
                    .careerLevelName(request.getCareerLevelName())
                    .countryId(request.getCountryId())
                    .countryName(request.getCountryName())
                    .gender(request.getGender())
                    .phone(request.getPhone())
                    .specializationName(request.getSpecializationName())
                    .role(user.getRole())
                    .build();
            routeUserData(createDoctorRequest);
            /*doctorServiceClient.addDoctor(createDoctorRequest);*/ /* Feign client to doctor-service*/

            return AuthResponse.builder()
                    .token("Doctor registered successfully")
                    .build();

        } catch (IdentityVerificationException e) {
            throw new IdentityVerificationException("National ID verification failed: " + e.getMessage());
        } catch (Exception e) {
            throw new ServiceCommunicationException("Doctor Service", e.getMessage());
        }
    }
    @Override
    public void routeUserData(CreateUserRequest userData) {
        routerGateway.routeUserData(userData);
    }
    /**
     * GUA_UA_U2
     **/
    public InquiryResponse verifyNationalId() {
        ResponseEntity<?> response = verificationServiceClient.createOcrInquiry();
        System.out.println(response.getStatusCode());
        System.out.println(response.getBody());

        try {
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ServiceCommunicationException("Verification Service",
                        "Received status code: " + response.getStatusCode());
            }

            Map<String, String> responseBody = (Map<String, String>) response.getBody();
            if (responseBody == null) {
                throw new ServiceCommunicationException("Verification Service",
                        "Empty response body");
            }
            return InquiryResponse.builder()
                    .inquiryId(responseBody.get("inquiryId"))
                    .verificationLink(responseBody.get("verificationLink"))
                    .build();

        } catch (Exception e) {
            throw new ServiceCommunicationException("Verification Service", e.getMessage());
        }
    }


    /**
     * GUA_UA_U3
     **/
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getNationalId(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new AuthenticationFailedException("Invalid national ID or password");
        }

        User user = userRepository.findByNationalId(request.getNationalId())
                .orElseThrow(() -> new UserNotFoundException("User not found with national ID: " + request.getNationalId()));

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    private boolean nationalIdExists(String nationalId) {
        return userRepository.findByNationalId(nationalId).isPresent();
    }

    public UserDTO getUserByNationalId(String nationalId) {
        User user = userRepository.findByNationalId(nationalId)
                .orElseThrow(() ->
                        new UserNotFoundException
                                ("User not found with national ID: "
                                        + nationalId));
        return UserDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .build();
    }

    public String extractUsername(String token) {
        return jwtService.extractUsername(token); // from your JWT utility/service
    }

    public void validateInquiryStatus(String inquiryId) {
        try {
            String status = verificationServiceClient.inquiryState(inquiryId);
            System.out.println("Status: "+status);
            if (status == null) {
                throw new IdentityVerificationException("No status received for inquiry: " + inquiryId);
            }

            if (!"approved".equalsIgnoreCase(status)) {
                throw new IdentityVerificationException("Inquiry " + inquiryId + " has status: " + status);
            }
        } catch (Exception e) {
            throw new ServiceCommunicationException("Verification Service", e.getMessage());
        }
    }


}