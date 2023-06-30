import { Component, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ngCVAProvider } from '../utils/control-value-accessor-provider';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cct-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ngCVAProvider(TextInputComponent)],
  template: `
    <input [formControl]="control" [placeholder]="placeholder" type="text" />
  `,
  styles: [
    `
      :host {
        width: 100%;

        input {
          width: 100%;
          padding: 0.25rem;
          border: solid var(--neutral);
          outline: none;
          border-radius: 0.25rem;
        }
      }
    `,
  ],
})
export class TextInputComponent implements ControlValueAccessor, OnDestroy {
  private fb = inject(NonNullableFormBuilder);

  @Input() placeholder = '';
  @Input() control = this.fb.control('');

  writeValue(value: string): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  private _destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
