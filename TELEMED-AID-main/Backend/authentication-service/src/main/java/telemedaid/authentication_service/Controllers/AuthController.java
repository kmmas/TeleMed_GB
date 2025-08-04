package telemedaid.authentication_service.Controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import telemedaid.authentication_service.DTOs.*;
import telemedaid.authentication_service.Exceptions.*;
import telemedaid.authentication_service.Services.AuthenticationService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    /**
     * GUA_UA_U1
     **/
    @PostMapping("/signup/patient")
    public ResponseEntity<?> registerPatient(@RequestBody RegisterPatientRequest request) {
        try {
            final ObjectMapper objectMapper = new ObjectMapper();
            String requestJson = objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(request);

            System.out.println("Request body: " +requestJson);
            return ResponseEntity.ok(authenticationService.registerPatient(request));
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Registration Conflict", e.getMessage()));
        } catch (IdentityVerificationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Verification Failed", e.getMessage()));
        } catch (ServiceCommunicationException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ErrorResponse("Service Unavailable", e.getMessage()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
    @PostMapping("/signup/doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody RegisterDoctorRequest request) throws JsonProcessingException {

        try {
            return ResponseEntity.ok(authenticationService.registerDoctor(request));
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Registration Conflict", e.getMessage()));
        } catch (IdentityVerificationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Verification Failed", e.getMessage()));
        } catch (ServiceCommunicationException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ErrorResponse("Service Unavailable", e.getMessage()));
        }
    }
    /**
     * GUA_UA_U2
     **/

    @GetMapping("/verify-id")
    public ResponseEntity<?> verifyNationalId() {
        try {
            return ResponseEntity.ok(authenticationService.verifyNationalId());
        } catch (ServiceCommunicationException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ErrorResponse("Verification Service Error", e.getMessage()));
        }
    }

    /**
     * GUA_UA_U3
     **/
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            AuthResponse authResponse = authenticationService.login(request);

            Cookie jwtCookie = new Cookie("jwt", authResponse.getToken());
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // Set to true in production with HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(24 * 60 * 60); // 1 day
            response.addCookie(jwtCookie);
            UserDTO user = authenticationService.getUserByNationalId(request.getNationalId());
            return ResponseEntity.ok(user);

        } catch (AuthenticationFailedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentication Failed", e.getMessage()));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("User Not Found", e.getMessage()));
        }
    }
    @GetMapping("/get-current-user")
    public ResponseEntity<?> getCurrentUser(@CookieValue(name = "jwt", required = false) String token){
        try {
            if (token == null || token.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized", "No JWT token found"));
            }

            String nationalId = authenticationService.extractUsername(token);
            UserDTO user = authenticationService.getUserByNationalId(nationalId);


            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("User Not Found", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Token Processing Error", "Invalid or expired token"));
        }

    }
}