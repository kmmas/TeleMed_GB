package telemedaid.common_dto.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KafkaEnricherDTO {
    private Long id;
    private String name;
    private String careerLevel;
    private String specializationName;
}
