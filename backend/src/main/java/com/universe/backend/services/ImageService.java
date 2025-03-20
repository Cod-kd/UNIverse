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

    private final Path profileUploadPath;
    private final Path postUploadPath;

    public ImageService(@Value("${file.upload-dir:./uploads/images}") String uploadDir) {
        this.profileUploadPath = Paths.get(uploadDir + "/profiles").toAbsolutePath().normalize();
        this.postUploadPath = Paths.get(uploadDir + "/posts").toAbsolutePath().normalize();
        
        System.out.println("Profile upload path: " + this.profileUploadPath);
        System.out.println("Post upload path: " + this.postUploadPath);
        
        createDirectoryIfNotExists(profileUploadPath);
        createDirectoryIfNotExists(postUploadPath);
    }

    private void createDirectoryIfNotExists(Path path) {
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                throw new RuntimeException("Failed to create upload directory: " + path, e);
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

    // For profile pictures
    public String storeProfileImage(MultipartFile file, Authentication authentication) throws IOException {
        Integer id = getPrincipal(authentication).getUserId();
        String fileExtension = getFileExtension(file);
        deleteExistingImages(profileUploadPath, id, "");
        String filename = id + fileExtension;
        Path filePath = profileUploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }

    // For post images
    public String storePostImage(MultipartFile file, Integer postId) throws IOException {
        String fileExtension = getFileExtension(file);
        deleteExistingImages(postUploadPath, postId, "post");
        String filename = "post" + postId + fileExtension;
        Path filePath = postUploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileExtension; // Return the extension to store in the post
    }
    
    private String getFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        return originalFilename != null && originalFilename.contains(".") ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
    }

    private void deleteExistingImages(Path directory, Integer id, String prefix) throws IOException {
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory, prefix + id + ".*")) {
            for (Path file : stream) {
                Files.deleteIfExists(file);
            }
        }
    }

    // For profile pictures
    public Resource loadProfileImage(Integer id) throws MalformedURLException, IOException {
        Path filePath = findImagePath(profileUploadPath, id, "");
        return loadResource(filePath, id);
    }

    // For post images
    public Resource loadPostImage(Integer postId) throws MalformedURLException, IOException {
        Path filePath = findImagePath(postUploadPath, postId, "post");
        return loadResource(filePath, postId);
    }

    private Path findImagePath(Path directory, Integer id, String prefix) throws MalformedURLException, IOException {
        Path filePath = null;
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory, prefix + id + ".*")) {
            for (Path path : stream) {
                if (Files.isRegularFile(path)) {
                    filePath = path;
                    break;
                }
            }
        } catch (IOException e) {
            throw new MalformedURLException("Hiba a fájlok beolvasása közben: " + e.getMessage());
        }

        if (filePath == null) {
            throw new MalformedURLException("A kép nem létezik az adott azonosítóhoz: " + id);
        }
        return filePath;
    }

    private Resource loadResource(Path filePath, Integer id) throws IOException {
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
        return "jpg";
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