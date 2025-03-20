package com.universe.backend.controllers;

import com.universe.backend.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/image")
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload/profilepicture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        try {
            String filename = imageService.storeProfileImage(file, authentication);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Profilkép sikeresen frissítve!");
            response.put("filename", filename);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Sikertelen művelet: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/upload/postimage/{postId}")
    public ResponseEntity<?> uploadPostImage(
            @PathVariable Integer postId,
            @RequestParam("file") MultipartFile file) {
        
        try {
            String extension = imageService.storePostImage(file, postId);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Poszt kép sikeresen feltöltve!");
            response.put("extension", extension);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Sikertelen művelet: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/get/profilepicture")
    public ResponseEntity<Resource> getProfilePicture(
            @RequestParam("id") Integer id) {
        
        try {
            Resource resource = imageService.loadProfileImage(id);
            String filename = resource.getFilename();
            String extension = filename != null && filename.contains(".") ?
                    filename.substring(filename.lastIndexOf(".") + 1) : "jpg";
            String contentType = imageService.determineContentType(extension);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Error-Message", "Kép nem található: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .headers(headers)
                    .body(null);
        } catch (IOException e) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Error-Message", "Hiba a kép betöltésekor: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .headers(headers)
                    .body(null);
        }
    }

    @GetMapping("/get/postimage")
    public ResponseEntity<Resource> getPostImage(
            @RequestParam("postId") Integer postId) {
        
        try {
            Resource resource = imageService.loadPostImage(postId);
            String filename = resource.getFilename();
            String extension = filename != null && filename.contains(".") ?
                    filename.substring(filename.lastIndexOf(".") + 1) : "jpg";
            String contentType = imageService.determineContentType(extension);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Error-Message", "Kép nem található: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .headers(headers)
                    .body(null);
        } catch (IOException e) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Error-Message", "Hiba a kép betöltésekor: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .headers(headers)
                    .body(null);
        }
    }
}