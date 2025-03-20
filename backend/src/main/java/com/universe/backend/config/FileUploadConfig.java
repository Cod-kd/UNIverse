package com.universe.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:./uploads/images}")
    private String uploadDir;

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path profileUploadPath = Paths.get(uploadDir + "/profiles").toAbsolutePath().normalize();
        Path postUploadPath = Paths.get(uploadDir + "/posts").toAbsolutePath().normalize();
        
        System.out.println("Profile resource handler path: " + profileUploadPath);
        System.out.println("Post resource handler path: " + postUploadPath);
        
        registry.addResourceHandler("/uploads/profiles/**")
                .addResourceLocations("file:" + profileUploadPath.toString() + "/");
        registry.addResourceHandler("/uploads/posts/**")
                .addResourceLocations("file:" + postUploadPath.toString() + "/");
    }
}