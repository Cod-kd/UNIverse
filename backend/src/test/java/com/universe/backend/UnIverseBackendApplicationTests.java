package com.universe.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "jwt.secret=this-is-a-very-long-secret-key-32-chars+")
class UNIverseBackendApplicationTests {
    @Test
    void contextLoads() {
    }
}