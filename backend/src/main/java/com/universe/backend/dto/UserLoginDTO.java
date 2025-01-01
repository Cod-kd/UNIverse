package com.universe.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserLoginDTO {
    @NotNull
    @Size(min = 6, max = 12, message = "A felhasználónév 6-12 karakter hosszú")
    private String usernameIn;

    @NotNull
    @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]+$", message="Helytelen jelszó (minimum 1 nagy-kisbetű és 1 szám)")
    @Size(min = 8, message = "A jelszavad legyen legalább 8 karakter")
    private String passwordIn;

    public String getUsernameIn() {
        return usernameIn;
    }

    public String getPasswordIn() {
        return passwordIn;
    }

    public void setUsernameIn(String usernameIn) {
        this.usernameIn = usernameIn;
    }

    public void setPasswordIn(String passwordIn) {
        this.passwordIn = passwordIn;
    }
}
