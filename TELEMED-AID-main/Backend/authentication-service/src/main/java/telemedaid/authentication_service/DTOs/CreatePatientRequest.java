package telemedaid.authentication_service.DTOs;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import telemedaid.authentication_service.Entities.Role;

import java.util.Date;


@Getter
@Setter
@Builder
public class CreatePatientRequest implements CreateUserRequest {
    private Long userId;
    private String name;
    private String countryName;
    private String countryId;
    private String gender;
    private String phone;
    private Date birthDate; // Format: "yyyy-MM-dd"
    private Role role;
}