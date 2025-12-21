package com.hahnsoftware.hahnsoftware.controllers.auth.dto;

public record AuthResponse(
        String token,
        String type
) {}
