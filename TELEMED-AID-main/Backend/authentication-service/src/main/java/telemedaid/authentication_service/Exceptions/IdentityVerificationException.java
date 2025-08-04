package telemedaid.authentication_service.Exceptions;

public class IdentityVerificationException extends RuntimeException {
    public IdentityVerificationException(String message) {
        super(message);
    }
}