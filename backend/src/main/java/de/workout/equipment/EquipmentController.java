package de.workout.equipment;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentRepository repository;

    @GetMapping
    public List<EquipmentDto> getAll() {
        return repository.findAll().stream().map(EquipmentDto::from).toList();
    }
}
