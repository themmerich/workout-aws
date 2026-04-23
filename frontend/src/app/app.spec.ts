import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTransloco, Translation, TranslocoLoader } from '@jsverse/transloco';
import { of } from 'rxjs';

import { App } from './app';

class StubTranslocoLoader implements TranslocoLoader {
  getTranslation() {
    return of<Translation>({});
  }
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTransloco({
          config: {
            availableLangs: ['de', 'en'],
            defaultLang: 'de',
          },
          loader: StubTranslocoLoader,
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
