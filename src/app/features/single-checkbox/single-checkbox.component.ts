import { Component, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputLabelComponent } from 'src/app/shared/input-label/input-label.component';
import { ngCVAProvider } from 'src/app/shared/utils/control-value-accessor-provider';
import { BasicCheckboxTreeStore } from 'src/app/shared/checkbox-tree/data-access/basic-checkbox-tree.store';
import { CheckboxComponent } from 'src/app/shared/checkbox/checkbox.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cct-single-checkbox',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    InputLabelComponent,
  ],
  providers: [ngCVAProvider(SingleCheckboxComponent), BasicCheckboxTreeStore],
  template: `
    <cct-input-label>{{ label }}</cct-input-label>

    <cct-checkbox [formControl]="control" (onChange)="toggleName($event)">
      {{ checkboxContent }}
    </cct-checkbox>
  `,
})
export class SingleCheckboxComponent
  implements ControlValueAccessor, OnDestroy
{
  private fb = inject(NonNullableFormBuilder);

  @Input() label!: string;

  checkboxContent: 'Me?' | 'Hell yeah, you are!' = 'Me?';

  control = this.fb.control(false);

  toggleName(checked: boolean) {
    this.checkboxContent = checked ? 'Hell yeah, you are!' : 'Me?';
  }

  writeValue(value: boolean): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  private _destroy$ = new Subject();

  ngOnDestroy() {
    this._destroy$.next(null);
  }
}
