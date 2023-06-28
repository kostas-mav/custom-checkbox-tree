import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterContentInit,
  HostListener,
  HostBinding,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'cct-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <i [class]="checkboxClass()"></i>
    <label #labelRef [ngStyle]="{ cursor: disabled ? 'default' : 'pointer' }">
      <ng-content></ng-content>
    </label>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
      }

      i {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.17);
        background-color: var(--tertiary);
        border-radius: 2px;
        height: 1rem;
        width: 1rem;
        min-width: 1rem;
        min-height: 1rem;
        font-size: 12px;
        font-weight: 700;
        color: white;
        cursor: pointer;
        -webkit-text-stroke: 1px;
      }
      i.unchecked {
        background-color: var(--neutral);
      }
      i.disabled {
        cursor: default;
        filter: opacity(50%);
      }
      label {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;

        color: var(--tertiary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
})
export class CheckboxComponent
  implements AfterContentInit, ControlValueAccessor
{
  @Input() checked: boolean = false;
  @Input() intermediate: boolean = false;
  @Input() disabled: boolean | undefined;

  @Output() onChange: Subject<boolean> = new Subject();

  @ViewChild('labelRef', { static: true }) labelRef!: ElementRef;

  // Class needs to be outside of the component
  @HostBinding('class.gap-2') hasGap = false;
  @HostListener('click')
  toggleCheckbox() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange.next(this.checked);
  }

  // Line-awesome icon class to represent checkbox state
  checkboxClass() {
    const classes = [];

    if (this.disabled) classes.push('disabled');

    if (this.checked) {
      classes.push('las la-check');
      return classes.join(' ');
    }

    if (this.intermediate) {
      classes.push('las la-minus');
      return classes.join(' ');
    }

    classes.push('unchecked');
    return classes.join(' ');
  }

  // Content inside el ref has not been set at the time OnInit runs.
  // In AfterViewInit the view has been set and can't be set again in the same life cycle hook.
  ngAfterContentInit() {
    this.hasGap = (this.labelRef.nativeElement as HTMLElement).innerHTML
      ? true
      : false;
  }

  writeValue(value: boolean) {
    this.checked = value;
  }
  registerOnChange(fn: Function) {
    this.onChange.subscribe((val) => fn(val));
  }
  registerOnTouched(fn: Function) {
    this.onChange.subscribe((val) => fn(val));
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
