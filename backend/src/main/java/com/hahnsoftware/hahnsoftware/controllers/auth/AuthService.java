package com.hahnsoftware.hahnsoftware.controllers.auth;

import com.hahnsoftware.hahnsoftware.controllers.auth.dto.AuthResponse;
import com.hahnsoftware.hahnsoftware.controllers.auth.dto.LoginRequest;
import com.hahnsoftware.hahnsoftware.controllers.auth.dto.SignupRequest;
import com.hahnsoftware.hahnsoftware.exception.ConflictException;
import com.hahnsoftware.hahnsoftware.repository.UserRepository;
import com.hahnsoftware.hahnsoftware.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hahnsoftware.hahnsoftware.models.User;

@Service
@RequiredArgsConstructor
public class AuthService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ConflictException("Email already in use");
        }

        User u = User.builder()
                .firstName(req.firstName())
                .lastName(req.lastName())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .build();

        userRepository.save(u);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        String token = jwtService.generateToken(req.email());
        return new AuthResponse(token, "Bearer");
    }
    public void logout() {}


}
