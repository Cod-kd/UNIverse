package com.universe.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.universe.backend.utils.JwtUtilForEmail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final JwtUtilForEmail jwtUtil;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Autowired
    public EmailService(JavaMailSender mailSender, JwtUtilForEmail jwtUtil) {
        this.mailSender = mailSender;
        this.jwtUtil = jwtUtil;
    }

    public void sendVerificationEmail(String to) throws MessagingException {
        String token = jwtUtil.generateVerificationToken(to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Aktíváld az UNIverse fiókod!");
        String verificationLink = baseUrl + "/user/verify?token=" + token;
        helper.setText(
            "<h1>Üdvözöl az UNIverse-um!</h1>" +
            "<p>Kérlek kattints az alábbi linkre, hogy ellenőrizhessük emailcímed helyességét:</p>" +
            "<a href=\"" + verificationLink + "\">Email ellenőrzése</a>",
            true
        );

        mailSender.send(message);
    }
}