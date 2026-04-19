package de.workout.equipment;

import java.util.Locale;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EquipmentCategory {
    MOBILITY,
    DUMBBELL,
    CARDIO,
    CABLE,
    MACHINE,
    BODYWEIGHT,
    OTHER;

    @JsonValue
    public String toJson() {
        return name().toLowerCase(Locale.ROOT);
    }

    @JsonCreator
    public static EquipmentCategory fromJson(String value) {
        return EquipmentCategory.valueOf(value.toUpperCase(Locale.ROOT));
    }
}
