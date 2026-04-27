import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BadgeModule } from 'primeng/badge';
import { StyleClassModule } from 'primeng/styleclass';

import { AuthService } from '../auth/auth-service';
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
  protected readonly auth = inject(AuthService);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);

  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected toggleLang(): void {
    const next = this.activeLang() === 'de' ? 'en' : 'de';
    this.transloco.setActiveLang(next);
  }

  protected logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      },
      error: () => {
        void this.router.navigateByUrl('/login');
      },
    });
  }
}
