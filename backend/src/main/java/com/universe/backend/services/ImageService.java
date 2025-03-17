package com.universe.backend.services;

import com.universe.backend.config.CustomUserPrincipal;
import com.universe.backend.exceptions.AuthenticationFailedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.security.core.Authentication;

@Service
public class ImageService {

    private final Path uploadPath;

    public ImageService(@Value("${file.upload-dir:./uploads/images}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir + "/profiles").toAbsolutePath().normalize();
        System.out.println("ImageService upload path: " + this.uploadPath);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to create upload directory: " + uploadPath, e);
            }
        }
    }
    
    private CustomUserPrincipal getPrincipal(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationFailedException("Felhasználó nincs bejelentkezve!");
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserPrincipal)) {
            throw new IllegalStateException("Érvénytelen felhasználói principal!");
        }
        return (CustomUserPrincipal) principal;
    }

    public String storeProfileImage(MultipartFile file, Authentication authentication) throws IOException {
        Integer id = getPrincipal(authentication).getUserId();
        // Get file extension from original filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        
        // Delete any existing profile pictures for this id
        deleteExistingProfilePictures(id);
        
        // Create the file path
        String filename = id + fileExtension;
        Path filePath = uploadPath.resolve(filename);
        
        // Save the file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return filename;
    }
    
    private void deleteExistingProfilePictures(Integer id) throws IOException {
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadPath, id + ".*")) {
            for (Path file : stream) {
                Files.deleteIfExists(file);
            }
        }
    }
    
    public Resource loadProfileImage(Integer id) throws MalformedURLException, IOException {
        // Scan the directory for a file matching the id
        Path filePath = null;
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadPath, id + ".*")) {
            for (Path path : stream) {
                if (Files.isRegularFile(path)) {
                    filePath = path;
                    break; // Use the first matching file
                }
            }
        } catch (IOException e) {
            throw new MalformedURLException("Hiba a fájlok beolvasása közben: " + e.getMessage());
        }

        if (filePath == null) {
            throw new MalformedURLException("A kép nem létezik az adott felhasználóhoz: " + id);
        }

        System.out.println("Loading image from: " + filePath.toAbsolutePath());
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new IOException("A kép nem olvasható vagy nem létezik: " + filePath);
        }
        return resource;
    }

    public String getExtensionFromFilePath(Path filePath) {
        String filename = filePath.getFileName().toString();
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex != -1) {
            return filename.substring(lastDotIndex + 1);
        }
        return "jpg"; // Fallback if no extension is found
    }
    
    public String determineContentType(String extension) {
        switch (extension.toLowerCase()) {
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "webp":
                return "image/webp";
            case "svg":
                return "image/svg+xml";
            default:
                return "image/jpeg";
        }
    }
}