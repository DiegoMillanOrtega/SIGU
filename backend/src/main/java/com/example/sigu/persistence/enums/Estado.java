package com.example.sigu.persistence.enums;

import lombok.Getter;

@Getter
public enum Estado {
    PENDIENTE("needsAction"),
    ENPROCESO("process"),
    COMPLETADA("completed");

    private final String googleStatus;

    Estado(String googleStatus) {
        this.googleStatus = googleStatus;
    }

    public static Estado fromGoogleStatus(String status) {
        if ("completed".equalsIgnoreCase(status)) {
            return COMPLETADA;
        }
        return PENDIENTE; // Por defecto
    }
}