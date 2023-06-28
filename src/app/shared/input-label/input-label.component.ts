import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cct-input-label',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;

        color: var(--tertiary);
      }
    `,
  ],
})
export class InputLabelComponent {}
