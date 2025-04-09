package com.universe.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/auth/delete").permitAll()
                        .requestMatchers("/user/registration").permitAll()
                        .requestMatchers("/user/all").permitAll()
                        .requestMatchers("/user/name/**").permitAll()
                        .requestMatchers("/user/common/**").permitAll()
                        .requestMatchers("/user/username").permitAll()
                        .requestMatchers("/user/verify").permitAll()
                        .requestMatchers("/user/id").permitAll()
                        .requestMatchers("/user/get/**").permitAll()
                        .requestMatchers("/groups/search").permitAll()
                        .requestMatchers("/groups").permitAll()
                        .requestMatchers("/groups/get").permitAll()
                        .requestMatchers("/groups/event/users_schedule").permitAll()
                        .requestMatchers("/groups/event/interested_users").permitAll()
                        .requestMatchers("/groups/name/*/events").permitAll()
                        .requestMatchers("/groups/name/*/posts").permitAll()
                        .requestMatchers("/groups/post/get/comment").permitAll()
                        .requestMatchers("/image/get/**").permitAll()
                        .anyRequest().authenticated() // All other endpoints require authentication
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // JWT filter
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://127.0.0.1:5500", "http://localhost:4200", "http://localhost:80"));
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}