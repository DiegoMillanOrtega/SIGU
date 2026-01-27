package com.example.sigu.persistence.entity;

import com.example.sigu.persistence.enums.Estado;
import com.example.sigu.persistence.enums.Prioridad;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "tareas")
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 50)
    private String titulo;
    private String descripcion;

    @Column(nullable = false, length = 100)
    private String taskId;

    @Column(nullable = false, length = 100)
    private String taskListId;

    @Column(nullable = false)
    private LocalDate fechaEntrega;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;

    @ManyToOne
    @JoinColumn(name = "materiaId", foreignKey = @ForeignKey(name = "fk_tarea_materia"), nullable = false)
    private Materia materia;

    @ManyToOne
    @JoinColumn(name = "archivoId", foreignKey = @ForeignKey(name = "fk_tarea_archivo"))
    private Archivo archivo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;


}



