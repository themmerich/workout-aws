import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Equipment } from '../model/equipment.model';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private readonly http = inject(HttpClient);
  private readonly equipments = toSignal(this.http.get<Equipment[]>('/api/equipment'), {
    initialValue: [] as Equipment[],
  });

  getAll(): Signal<Equipment[]> {
    return this.equipments;
  }
}
