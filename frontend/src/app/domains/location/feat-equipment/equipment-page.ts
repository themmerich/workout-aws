import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { EquipmentService } from '../data/equipment.service';

interface EquipmentColumn {
  field: 'id' | 'name' | 'category';
  labelKey: string;
}

@Component({
  selector: 'app-equipment-page',
  imports: [
    FormsModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    ProgressSpinnerModule,
    TranslocoDirective,
    TranslocoPipe,
  ],
  templateUrl: './equipment-page.html',
  styleUrl: './equipment-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentPage {
  private readonly equipmentService = inject(EquipmentService);

  protected readonly equipmentsResource = this.equipmentService.getAll();
  protected readonly table = viewChild(Table);

  protected readonly allColumns: EquipmentColumn[] = [
    { field: 'id', labelKey: 'equipment.columns.id' },
    { field: 'name', labelKey: 'equipment.columns.name' },
    { field: 'category', labelKey: 'equipment.columns.category' },
  ];

  protected readonly visibleColumns = signal<EquipmentColumn[]>(this.allColumns);

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.table()?.filterGlobal(value, 'contains');
  }
}
