package com.cyb.board.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {

    @Value("${encryption.key}")
    private String secretKey;
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH_BYTE = 12;
    private static final int TAG_LENGTH_BIT = 128;

    public String encrypt(String plainText) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secretKey);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");

            byte[] iv = new byte[IV_LENGTH_BYTE];
            new SecureRandom().nextBytes(iv);

            GCMParameterSpec gcmParamSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmParamSpec);

            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            byte[] combined = new byte[iv.length + encryptedBytes.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedBytes, 0, combined, iv.length, encryptedBytes.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("데이터 암호화 중 오류 발생", e);
        }
    }

    public String decrypt(String encryptedText) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secretKey);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");

            byte[] combined = Base64.getDecoder().decode(encryptedText);

            GCMParameterSpec gcmParamSpec = new GCMParameterSpec(TAG_LENGTH_BIT, combined, 0, IV_LENGTH_BYTE);

            Cipher cipher = Cipher.getInstance(ALGORITHM);

            cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmParamSpec);

            byte[] decryptedBytes = cipher.doFinal(combined, IV_LENGTH_BYTE, combined.length - IV_LENGTH_BYTE);

            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "";
        }
    }
}