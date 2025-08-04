package telemedaid.authentication_service.Exceptions;

public class ServiceCommunicationException extends RuntimeException {
    public ServiceCommunicationException(String serviceName, String message) {
        super("Failed to communicate with " + serviceName + ": " + message);
    }
}
