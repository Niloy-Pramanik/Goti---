package com.prokoi.email;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        // Since we will use Gmail, the 'from' address will automatically be rewritten to your Gmail address by Google's SMTP servers.
        message.setFrom("noreply@prokoi.com"); 
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        
        try {
            mailSender.send(message);
            System.out.println("Email successfully sent to " + to);
            System.out.println("Email Content:\n" + text);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
            System.out.println("==== DEVELOPMENT MODE: EMAIL CONTENT FALLBACK ====");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body:\n" + text);
            System.out.println("==================================================");
        }
    }
}
