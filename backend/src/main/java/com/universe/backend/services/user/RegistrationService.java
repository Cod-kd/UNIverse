package com.universe.backend.services.user;

import com.universe.backend.dto.UserRegistrationDTO;
import com.universe.backend.exceptions.UserAlreadyExistsException;
import com.universe.backend.services.EmailService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import java.sql.CallableStatement;

@Service
public class RegistrationService {

    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder encoder;
    private final EmailService es;

    public RegistrationService(JdbcTemplate jdbcTemplate, EmailService es) {
        this.jdbcTemplate = jdbcTemplate;
        this.encoder = new BCryptPasswordEncoder(12);
        this.es = es;
    }

    public void registerUser(UserRegistrationDTO urDTO) throws MessagingException {
        try {
            urDTO.setPasswordIn(encoder.encode(urDTO.getPasswordIn()));
            jdbcTemplate.execute((ConnectionCallback<Object>) connection -> {
                CallableStatement callableStatement = connection.prepareCall("{CALL registerUser(?, ?, ?, ?, ?, ?, ?, ?, ?)}");
                callableStatement.setString(1, urDTO.getEmailIn());
                callableStatement.setString(2, urDTO.getUsernameIn());
                callableStatement.setString(3, urDTO.getPasswordIn());
                callableStatement.setString(4, urDTO.getNameIn());
                if (urDTO.getGenderIn() != null) {
                    callableStatement.setBoolean(5, urDTO.getGenderIn());
                } else {
                    callableStatement.setNull(5, java.sql.Types.BOOLEAN);
                }
                callableStatement.setDate(6, new java.sql.Date(urDTO.getBirthDateIn().getTime()));
                callableStatement.setString(7, urDTO.getFacultyIn());
                callableStatement.setString(8, urDTO.getUniversityNameIn());
                callableStatement.setString(9, urDTO.getProfilePictureExtensionIn());
                callableStatement.execute();
                return null;
            });

            // Send verification email after successful registration
            es.sendVerificationEmail(urDTO.getEmailIn());

        } catch (DuplicateKeyException ex) {
            throw new UserAlreadyExistsException("A felhasználónév vagy email már foglalt.");
        } catch (MessagingException ex) {
            throw new MessagingException("Email küldése sikertelen: " + ex.getMessage(), ex);
        }
    }
}