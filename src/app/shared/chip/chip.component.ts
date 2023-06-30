import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'cct-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="text-xs">{{ label }}</label>
    <i *ngIf="deletionEnabled" (click)="remove.next()" class="las la-times"></i>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
        background-color: var(--tertiary);
        color: #ffffff;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        width: fit-content;

        font-weight: 400;
        font-size: 16px;
        line-height: 20px;

        i {
          cursor: pointer;
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class ChipComponent {
  @Input() label!: string;
  /**
   * Enable the 'X' button to trigger the "remove" subject's event emittion.
   */
  @Input() set enableDelete(val: '' | boolean) {
    if (typeof val === 'string') {
      this.deletionEnabled = true;
    } else {
      this.deletionEnabled = val;
    }
  }

  @Output() remove = new Subject<void>();

  deletionEnabled: boolean = false;
}
