package com.example.sigu.persistence.entity;

import com.example.sigu.presentation.dto.semestre.CargaAcademica;
import com.example.sigu.presentation.dto.semestre.EstadoSemestre;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "semestres")
public class Semestre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Integer anio;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String taskListId;

    @Enumerated(EnumType.STRING)
    private EstadoSemestre estado;

    @OneToMany(mappedBy = "semestre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Materia> materias;

    @ManyToOne
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "fk_semestre_usuario"))
    private Usuario usuario;



    @Transient
    public Double getProgreso() {
        long total = ChronoUnit.DAYS.between(this.fechaInicio, this.fechaFin);
        long transcurrido = ChronoUnit.DAYS.between(this.fechaInicio, LocalDate.now());

        if (transcurrido < 0) return 0.0;
        if (total <= 0) return 100.0;

        double resultado = (transcurrido * 100.0) / total;
        return Math.clamp(resultado, 0.0, 100.0);
    }

    @Transient
    public CargaAcademica getCargaAcademica() {
        int totalMaterias = (materias == null) ? 0 : materias.size();

        return switch (totalMaterias) {
            case 0, 1, 2, 3, 4 -> CargaAcademica.BAJA;
            case 5, 6          -> CargaAcademica.MEDIA;
            default            -> CargaAcademica.ALTA;
        };
    }

    @Transient
    public Integer getCreditosTotales() {
        return (materias == null) ? 0 : materias.stream().mapToInt(Materia::getNumCreditos).sum();
    }

    @Transient
    public Integer getNumeroMaterias() {
        return (materias == null) ? 0 : materias.size();
    }

    @Transient
    public Integer getMateriasAprobadas() {
        if (materias == null || materias.isEmpty()) {
            return 0;
        }

        return (int) materias.stream()
                .filter(materia -> materia.getPromedio().compareTo(BigDecimal.valueOf(3.0)) >= 0)
                .count();
    }

    @Transient
    public Integer getMateriasEnCurso() {
        if (materias == null || materias.isEmpty()) return 0;
        return EstadoSemestre.ACTIVO.equals(estado) ? materias.size() - getMateriasAprobadas() : 0;
    }

    @Transient
    public Integer getMateriasPendientes() {
        if (materias == null || materias.isEmpty()) return 0;
        return EstadoSemestre.PLANIFICADO.equals(estado) ? materias.size() : 0;
    }

    @Transient
    public Double getPromedioActual() {
        if (materias == null || materias.isEmpty()) return 0.0;

        return materias.stream()
                .mapToDouble(m -> m.getPromedio().doubleValue())
                .average() // Calcula el promedio en lugar de la suma
                .orElse(0.0);
    }
}
