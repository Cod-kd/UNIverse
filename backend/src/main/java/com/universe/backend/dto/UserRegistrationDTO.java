package com.universe.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Date;

public class UserRegistrationDTO {
    @NotNull
    @Email(message = "Invalid email format")
    private String emailIn;

    @NotNull
    @Size(min = 6, max = 12, message = "Username must be between 6 and 12 characters")
    private String usernameIn;

    @NotNull
    @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]$", message="Helytelen jelszó (minimum 1 nagy-kisbetű és 1 szám)")
    @Size(min = 8, message = "A jelszavad legyen legalább 8 karakter")
    private String passwordIn;

    @NotNull
    @Size(min = 1, message = "Add meg a neved")
    private String nameIn;

    @NotNull(message = "Add meg a nemed")
    private Boolean genderIn;

    @NotNull(message = "Add meg a születésed")
    private Date birthDateIn;

    @NotNull
    @Size(min = 1, message = "Add meg a fakultációt")
    private String facultyIn;

    @NotNull
    @Size(min = 1, message = "Add meg az egyetemet")
    private String universityNameIn;

    @NotNull
    @Size(min = 1, max = 4, message = "Tölts fel profilképet")
    private String profilePictureExtensionIn;

    public String getEmailIn() {
        return emailIn;
    }

    public String getUsernameIn() {
        return usernameIn;
    }

    public String getPasswordIn() {
        return passwordIn;
    }

    public String getNameIn() {
        return nameIn;
    }

    public Boolean getGenderIn() {
        return genderIn;
    }

    public Date getBirthDateIn() {
        return birthDateIn;
    }

    public String getFacultyIn() {
        return facultyIn;
    }

    public String getUniversityNameIn() {
        return universityNameIn;
    }

    public String getProfilePictureExtensionIn() {
        return profilePictureExtensionIn;
    }

    public void setEmailIn(String emailIn) {
        this.emailIn = emailIn;
    }

    public void setUsernameIn(String usernameIn) {
        this.usernameIn = usernameIn;
    }

    public void setPasswordIn(String passwordIn) {
        this.passwordIn = passwordIn;
    }

    public void setNameIn(String nameIn) {
        this.nameIn = nameIn;
    }

    public void setGenderIn(Boolean genderIn) {
        this.genderIn = genderIn;
    }

    public void setBirthDateIn(Date birthDateIn) {
        this.birthDateIn = birthDateIn;
    }

    public void setFacultyIn(String facultyIn) {
        this.facultyIn = facultyIn;
    }

    public void setUniversityNameIn(String universityNameIn) {
        this.universityNameIn = universityNameIn;
    }

    public void setProfilePictureExtensionIn(String profilePictureExtensionIn) {
        this.profilePictureExtensionIn = profilePictureExtensionIn;
    }

    
}
