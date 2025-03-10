import string
import random
import urllib.parse
import base64

def fibonacci(n):
    """Generate the first n Fibonacci numbers."""
    fib_sequence = [0, 1]
    for i in range(2, n):
        fib_sequence.append(fib_sequence[-1] + fib_sequence[-2])
    return fib_sequence

def shift_char(c, shift_value):
    """Shift a character by a given number of positions in the alphanumeric range."""
    all_chars = string.ascii_letters + string.digits + string.punctuation
    num_chars = len(all_chars)
    
    # Find the current index of the character in the allowed range
    idx = all_chars.index(c)
    
    # Apply the shift and wrap around using modulo
    new_idx = (idx + shift_value) % num_chars
    
    # Return the character at the new shifted index
    return all_chars[new_idx]

def shift_char_reverse(c, shift_value):
    """Reverse shift a character by a given number of positions in the allowed range."""
    all_chars = string.ascii_letters + string.digits + string.punctuation
    num_chars = len(all_chars)
    
    # Find the current index of the character in the allowed range
    idx = all_chars.index(c)
    
    # Apply the reverse shift and wrap around using modulo
    new_idx = (idx - shift_value) % num_chars
    
    # Return the character at the new shifted index
    return all_chars[new_idx]

def generate_valid_string(min_length=8):
    """Generate a random valid string with at least one lowercase, one uppercase, one number, and special characters."""
    while True:
        chars = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(chars) for _ in range(min_length))
        
        # Check if it satisfies the pattern constraints
        if (any(c.islower() for c in password) and
            any(c.isupper() for c in password) and
            any(c.isdigit() for c in password) and
            len(password) >= min_length):
            return password

def encode_string(input_string):
    """Encode the input string using Fibonacci-based shifting."""
    # Generate Fibonacci sequence based on the input length
    fib_sequence = fibonacci(len(input_string))
    
    # Encode the string
    encoded_string = ""
    for i, char in enumerate(input_string):
        shift_value = fib_sequence[i] + (i + 1)  # Fibonacci + (i+1) for encoding
        encoded_string += shift_char(char, shift_value)
    
    # URL-encode the resulting string to make it URL-safe
    return urllib.parse.quote(encoded_string)

def decode_string(encoded_string):
    """Decode the encoded string by reversing the Fibonacci-based shifting."""
    # URL-decode the encoded string to get the original encoded format
    decoded_string = urllib.parse.unquote(encoded_string)
    
    # Generate Fibonacci sequence based on the decoded string length
    fib_sequence = fibonacci(len(decoded_string))
    
    # Decode the string
    original_string = ""
    for i, char in enumerate(decoded_string):
        shift_value = fib_sequence[i] + (i + 1)  # Fibonacci + (i+1) for encoding
        original_string += shift_char_reverse(char, shift_value)
    
    return original_string

def generate_url(base_url, username, password):
    """Generate the login URL with encoded username and password."""
    encoded_username = encode_string(username)
    encoded_password = encode_string(password)
    
    return f"{base_url}/login/?x1={encoded_username}&x2={encoded_password}"

def decode_url(encoded_username, encoded_password):
    """Decode the URL to retrieve the original username and password."""
    decoded_username = decode_string(encoded_username)
    decoded_password = decode_string(encoded_password)
    
    return decoded_username, decoded_password

# Example usage
base_url = "https://example.com"

# Generate valid username and password
username = generate_valid_string(min_length=8)
password = generate_valid_string(min_length=8)

print(f"Original Username: {username}")
print(f"Original Password: {password}")

# Generate URL
url = generate_url(base_url, username, password)
print(f"Generated URL: {url}")

# Decode the URL
# Extract the encoded username and password from the URL (assuming you got these from URL)
encoded_username = url.split("x1=")[1].split("&x2=")[0]
encoded_password = url.split("x2=")[1]

decoded_username, decoded_password = decode_url(encoded_username, encoded_password)

print(f"Decoded Username: {decoded_username}")
print(f"Decoded Password: {decoded_password}")
