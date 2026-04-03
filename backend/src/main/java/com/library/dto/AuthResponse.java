package com.library.dto;

import lombok.Data;

/**
 * DTO returned to the client after successful authentication.
 * Contains the JWT token and basic user info.
 */
@Data
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private String role;

    public AuthResponse(String token, Long userId, String name, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
