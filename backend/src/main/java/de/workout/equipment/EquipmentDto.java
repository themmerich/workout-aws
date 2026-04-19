package de.workout.equipment;

import java.util.UUID;

public record EquipmentDto(UUID id, String name, EquipmentCategory category) {

    public static EquipmentDto from(Equipment equipment) {
        return new EquipmentDto(equipment.getId(), equipment.getName(), equipment.getCategory());
    }
}
