package com.universe.backend.services;

import com.universe.backend.dto.UserRegistrationDTO;
import com.universe.backend.exceptions.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ConnectionCallback;
import java.sql.CallableStatement;


@Service
public class RegistrationService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void registerUser(UserRegistrationDTO urDTO) {

        try {
            // Call the stored procedure to create the user
            jdbcTemplate.execute((ConnectionCallback<Object>) connection -> {
                CallableStatement callableStatement = connection.prepareCall("{CALL registerUser(?, ?, ?, ?, ?, ?, ?, ?, ?)}");
                callableStatement.setString(1, urDTO.getEmailIn());
                callableStatement.setString(2, urDTO.getUsernameIn());
                callableStatement.setString(3, urDTO.getPasswordIn());
                callableStatement.setString(4, urDTO.getNameIn());
                callableStatement.setBoolean(5, urDTO.getGenderIn());
                callableStatement.setDate(6, new java.sql.Date(urDTO.getBirthDateIn().getTime()));
                callableStatement.setString(7, urDTO.getFacultyIn());
                callableStatement.setString(8, urDTO.getUniversityNameIn());
                callableStatement.setString(9, urDTO.getProfilePictureExtensionIn());
                callableStatement.execute();
                return null; // Since no return value is required
            });


        } catch (DuplicateKeyException ex) {
            throw new UserAlreadyExistsException("A felhasználónév vagy email már foglalt.");
        }
    }
}