package com.example.sigu.persistence.entity;

import com.example.sigu.persistence.enums.ParcialEstado;
import com.example.sigu.persistence.enums.Prioridad;
import com.example.sigu.persistence.enums.TipoEvaluacion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "parciales")
public class Parcial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvaluacion tipo;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    private String lugar;
    private String temaEvaluar;
    private String notaAdicional;

    @Enumerated(EnumType.STRING)
    private ParcialEstado estado;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;

    @ManyToOne
    @JoinColumn(name = "materia_id", foreignKey = @ForeignKey(name = "fk_parcial_materia"))
    private Materia materia;



}
