export type EquipmentCategory =
  | 'mobility'
  | 'dumbbell'
  | 'cardio'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'other';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
}

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  'mobility',
  'dumbbell',
  'cardio',
  'cable',
  'machine',
  'bodyweight',
  'other',
];
