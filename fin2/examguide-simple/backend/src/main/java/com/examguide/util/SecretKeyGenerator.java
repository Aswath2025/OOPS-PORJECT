package com.examguide.util;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

public class SecretKeyGenerator {
    
    public static void main(String[] args) {
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        String encodedKey = Encoders.BASE64.encode(key.getEncoded());
        System.out.println("Generated JWT Secret Key:");
        System.out.println(encodedKey);
    }
}
