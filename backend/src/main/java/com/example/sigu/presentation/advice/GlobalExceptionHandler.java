package com.example.sigu.presentation.advice;

import com.example.sigu.presentation.dto.ErrorResponse;
import com.example.sigu.service.exception.*;
import com.google.api.client.auth.oauth2.TokenResponseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handle(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(SemestreNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleSemestreNotFoundException(SemestreNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(ActiveSemestreAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleActiveSemestreAlreadyExistsException(ActiveSemestreAlreadyExistsException ex) {
        return new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(MateriaNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleMateriaNotFoundException(MateriaNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(SemesterOverlapException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleSemesterOverlapException(SemesterOverlapException ex) {
        return new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(UsuarioNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUsuarioNotFoundException(UsuarioNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        return new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(ArchivoNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleArchivoNotFoundException(ArchivoNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(TareaNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleTareaNotFoundException(TareaNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(NotaNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotaNotFoundException(NotaNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(ParcialNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleParcialNotFoundException(ParcialNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(NotaCalcularRequerimientoException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleNotaCalcularRequerimientoException(NotaCalcularRequerimientoException ex) {
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(AuthException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthException(AuthException ex) {
        return new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Map<String, String>> handleIOException(IOException ex) {
        log.error("Error de IO: ", ex);
        Map<String, String> error = new HashMap<>();
        error.put("error", "Error de entrada/salida");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        log.error("Archivo demasiado grande: ", ex);
        Map<String, String> error = new HashMap<>();
        error.put("error", "El archivo es demasiado grande");
        error.put("message", "El tamaño máximo permitido es 50MB");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        log.error("Error general: ", ex);
        Map<String, String> error = new HashMap<>();
        error.put("error", "Error interno del servidor");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(GoogleIntegrationException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    //TODO: Mejorar el handleGoogleException
    public ErrorResponse handleGoogleIntegrationException(GoogleIntegrationException ex) {
        if (ex.getCause() instanceof TokenResponseException tokenException) {
            if ("invalid_grant".equals(tokenException.getDetails().getError())) {
                return new ErrorResponse(
                        HttpStatus.BAD_GATEWAY.value(),
                        "TOKEN_EXPIRED: El token de Google ha expirado. Re-autenticación necesaria.",
                        Instant.now()
                );
            }
        }
        return new ErrorResponse(
                HttpStatus.BAD_GATEWAY.value(),
                ex.getMessage(),
                Instant.now()
        );
    }

    @ExceptionHandler(TokenResponseException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleGoogleTokenException(TokenResponseException ex) {
        return new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getDetails().getError(),
                Instant.now()
        );
    }


}
