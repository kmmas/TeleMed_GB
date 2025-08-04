package telemedaid.authentication_service.DTOs;

import lombok.Builder;
import lombok.Data;
import telemedaid.authentication_service.Entities.Role;

@Builder
@Data
public class UserDTO {
    private Long id;
    private Role role;
}
