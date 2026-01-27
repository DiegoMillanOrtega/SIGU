package com.example.sigu.service.implementation;

import com.example.sigu.persistence.entity.Parcial;
import com.example.sigu.persistence.repository.IParcialRepository;
import com.example.sigu.presentation.dto.parcial.ParcialRequest;
import com.example.sigu.service.exception.ParcialNotFoundException;
import com.example.sigu.service.interfaces.IMateriaService;
import com.example.sigu.service.interfaces.IParcialService;
import com.example.sigu.util.SecurityUtils;
import com.example.sigu.util.mapper.ParcialMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParcialServiceImpl implements IParcialService {

    private final IParcialRepository repository;
    private final IMateriaService materiaService;
    private final ParcialMapper mapper;
    private final SecurityUtils securityUtils;

    @Override
    public List<Parcial> findAll() {
        return repository.findAllByMateria_Semestre_UsuarioId(securityUtils.getCurrentUserId());
    }

    @Override
    public List<Parcial> findAllBySemestreActivo() {
        return repository.findAllBySemestreActivo();
    }

    @Override
    public Parcial findById(Long id) {
        return repository.findByIdAndMateria_Semestre_UsuarioId(id, securityUtils.getCurrentUserId())
                .orElseThrow(() -> new ParcialNotFoundException("No existe parcial asociado al ID: " + id));
    }

    @Override
    public Parcial save(ParcialRequest request) {
        Parcial parcial = mapper.toEntity(request);
        parcial.setMateria(materiaService.findById(request.materiaId()));
        return repository.save(parcial);
    }

    @Override
    public void delete(Long id) {
        repository.delete(findById(id));
    }
}
