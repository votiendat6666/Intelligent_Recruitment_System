package com.SmartRecruit.backend_springboot.service.Setting;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    private final String FROM_EMAIL = "votiendat842004@gmail.com";

    /**
     * Gửi email xác thực tài khoản
     */
    public void sendVerificationEmail(String toEmail, String token, String fullName) {
        try {
            // 1. Tạo Context để truyền biến vào HTML
            Context context = new Context();
            String link = "http://localhost:8080/auth/verify?token=" + token;

            context.setVariable("fullName", fullName);
            context.setVariable("verificationUrl", link);

            // 2. Sử dụng templateEngine để render HTML từ file
            // Lưu ý: Đường dẫn này tương ứng với: src/main/resources/templates/email/verification_email.html
            String htmlContent = templateEngine.process("verification_email", context);

            // 3. Gửi Mail
            sendHtmlMail(toEmail, "Xác thực tài khoản - IntelligentRecruit", htmlContent);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi chuẩn bị email xác thực: " + e.getMessage());
        }
    }

    /**
     * Hàm dùng chung để gửi email định dạng HTML
     */
    private void sendHtmlMail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(FROM_EMAIL);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true nghĩa là gửi nội dung dạng HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi mail qua SMTP: " + e.getMessage());
        }
    }
}