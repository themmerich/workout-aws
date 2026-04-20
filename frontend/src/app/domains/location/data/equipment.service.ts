import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from '../model/equipment.model';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private readonly equipments = httpResource<Equipment[]>(() => '/api/equipment', {
    defaultValue: [],
  });

  getAll(): HttpResourceRef<Equipment[]> {
    return this.equipments;
  }
}
