import { Injectable, Signal, signal } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { MOCK_EQUIPMENTS } from './equipment.mock';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private readonly _equipments = signal<Equipment[]>(MOCK_EQUIPMENTS);

  getAll(): Signal<Equipment[]> {
    return this._equipments.asReadonly();
  }
}
