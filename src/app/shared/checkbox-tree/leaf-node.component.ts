import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BasicCheckboxTreeStore } from './data-access/basic-checkbox-tree.store';
import { CheckboxLeafNode, CheckboxTreeItem } from './utils/types';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'leaf-node',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxComponent],
  template: `
    <cct-checkbox
      class="break-words"
      [checked]="leafNode.state === 'checked'"
      [disabled]="(disabled$ | async) ?? false"
      (onChange)="onChange($event)"
    >
      {{ leafNode.label }}
    </cct-checkbox>
  `,
  styles: [
    `
      :host {
        word-break: break-word;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeafNodeComponent {
  @Input() leafNode!: CheckboxLeafNode;
  @Input() onToggle!: (node: CheckboxTreeItem) => void;

  disabled$ = this.store.disabled$;

  onChange(selected: boolean) {
    this.leafNode.state = selected ? 'checked' : 'unchecked';
    this.onToggle(this.leafNode);
  }

  constructor(private store: BasicCheckboxTreeStore) {}
}
