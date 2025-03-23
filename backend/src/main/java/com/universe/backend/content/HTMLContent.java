package com.universe.backend.content;

public class HTMLContent {
    public static final String registrationSuccess = """
            <!DOCTYPE html>
            <html lang="hu">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sikeres regisztráció</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
                <style>
                    body {
                        background-color: #343434;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .message-box {
                        background-color: #141414;
                        padding: 30px 60px;
                        border-radius: 15px;
                        text-align: center;
                    }
                    h1 {
                        color: #FF5A1F;
                        font-size: 48px;
                        margin: 0;
                        font-family: 'Poppins', Arial, sans-serif;
                        font-weight: 700;
                    }
                </style>
            </head>
            <body>
                <div class="message-box">
                    <h1>Sikeres regisztráció!</h1>
                </div>
            </body>
            </html>
            """;
}