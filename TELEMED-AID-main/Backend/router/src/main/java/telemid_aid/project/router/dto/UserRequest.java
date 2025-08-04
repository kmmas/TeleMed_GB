package telemid_aid.project.router.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserRequest {
    private Long userId;
    private String name;
    private String countryName;
    private String countryId;
    private String gender;
    private String phone;
    private Date birthDate;
    private String careerLevelName;
    private String specializationName;
    private String role;
}