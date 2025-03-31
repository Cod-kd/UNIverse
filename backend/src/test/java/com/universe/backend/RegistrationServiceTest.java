package com.universe.backend;

import com.universe.backend.dto.UserRegistrationDTO;
import com.universe.backend.exceptions.UserAlreadyExistsException;
import com.universe.backend.services.EmailService;
import com.universe.backend.services.user.RegistrationService;
import jakarta.mail.MessagingException;
import java.util.Date;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ConnectionCallback;

class RegistrationServiceTest {

    private RegistrationService registrationService;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        registrationService = new RegistrationService(jdbcTemplate, emailService);
    }

    private UserRegistrationDTO createValidUserDTO() {
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setEmailIn("test@example.com");
        dto.setUsernameIn("testuser");
        dto.setPasswordIn("ValidPass123");
        dto.setNameIn("Test User");
        dto.setGenderIn(true);
        dto.setBirthDateIn(new Date());
        dto.setFacultyIn("Computer Science");
        dto.setUniversityNameIn("Test University");
        dto.setProfilePictureExtensionIn("png");
        return dto;
    }

    @Test
    void registerUser_Successful() throws MessagingException {
        // Arrange
        UserRegistrationDTO dto = createValidUserDTO();
        
        // Mock the execute method with a ConnectionCallback argument
        doReturn(null).when(jdbcTemplate).execute(ArgumentMatchers.<ConnectionCallback<Object>>any());
        doNothing().when(emailService).sendVerificationEmail(dto.getEmailIn());

        // Act
        assertDoesNotThrow(() -> registrationService.registerUser(dto));

        // Assert
        verify(jdbcTemplate).execute(ArgumentMatchers.<ConnectionCallback<Object>>any());
        verify(emailService).sendVerificationEmail(dto.getEmailIn());
    }

    @Test
    void registerUser_DuplicateUser() throws MessagingException {
        // Arrange
        UserRegistrationDTO dto = createValidUserDTO();
        
        // Simulate duplicate key exception
        doThrow(new DuplicateKeyException("Duplicate user"))
            .when(jdbcTemplate).execute(ArgumentMatchers.<ConnectionCallback<Object>>any());

        // Act & Assert
        UserAlreadyExistsException exception = assertThrows(
            UserAlreadyExistsException.class, 
            () -> registrationService.registerUser(dto)
        );

        assertEquals("A felhasználónév vagy email már foglalt.", exception.getMessage());
    }

    @Test
    void registerUser_EmailSendingFailed() throws MessagingException {
        UserRegistrationDTO dto = createValidUserDTO();
        
        // Ensure DB operation succeeds
        doReturn(null).when(jdbcTemplate).execute(ArgumentMatchers.<ConnectionCallback<Object>>any());
        
        // Simulate email sending failure
        doThrow(new MessagingException("Email sending failed"))
            .when(emailService).sendVerificationEmail(dto.getEmailIn());

        // Act & Assert
        MessagingException exception = assertThrows(
            MessagingException.class, 
            () -> registrationService.registerUser(dto)
        );

        assertTrue(exception.getMessage().contains("Email küldése sikertelen"));
    }

    @Test
    void registerUser_PasswordEncryption() throws MessagingException {
        // Arrange
        UserRegistrationDTO dto = createValidUserDTO();
        String originalPassword = dto.getPasswordIn();
        
        // Mock the execute method with a ConnectionCallback argument
        doReturn(null).when(jdbcTemplate).execute(ArgumentMatchers.<ConnectionCallback<Object>>any());
        doNothing().when(emailService).sendVerificationEmail(dto.getEmailIn());

        // Act
        registrationService.registerUser(dto);

        // Assert
        // Verify that the password is different after encryption
        assertNotEquals(originalPassword, dto.getPasswordIn());
        assertTrue(dto.getPasswordIn().startsWith("$2a$12$")); // BCrypt pattern
    }
}