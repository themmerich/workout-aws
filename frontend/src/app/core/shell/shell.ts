import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BadgeModule } from 'primeng/badge';
import { StyleClassModule } from 'primeng/styleclass';

import { ThemeModeService } from '../theme/theme-mode-service';

@Component({
  selector: 'app-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    BadgeModule,
    StyleClassModule,
    TranslocoDirective,
  ],
  templateUrl: './shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected readonly themeMode = inject(ThemeModeService);
  private readonly transloco = inject(TranslocoService);

  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected toggleLang(): void {
    const next = this.activeLang() === 'de' ? 'en' : 'de';
    this.transloco.setActiveLang(next);
  }
}
