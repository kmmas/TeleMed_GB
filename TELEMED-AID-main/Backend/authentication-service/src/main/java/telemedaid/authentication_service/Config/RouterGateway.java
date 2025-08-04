package telemedaid.authentication_service.Config;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;
import telemedaid.authentication_service.DTOs.CreateUserRequest;

@MessagingGateway
public interface RouterGateway {
    @Gateway(requestChannel = "routerChannel")
    void routeUserData(CreateUserRequest userData);
}