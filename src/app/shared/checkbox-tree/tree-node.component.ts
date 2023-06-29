import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BasicCheckboxTreeStore } from './data-access/basic-checkbox-tree.store';
import { CheckboxTreeItem, CheckboxTreeNode } from './utils/types';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { LeafNodeComponent } from './leaf-node.component';

@Component({
  selector: 'tree-node',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    LeafNodeComponent,
  ],
  template: `
    <li class="flex items-center gap-2 w-full">
      <cct-checkbox
        [checked]="treeNode.state === 'checked'"
        [disabled]="(disabled$ | async) ?? false"
        [intermediate]="treeNode.state === 'intermediate'"
        (onChange)="onChange($event)"
      ></cct-checkbox>
      <label
        (click)="onToggleExpand()"
        class="flex items-center justify-between flex-1 gap-4 cursor-pointer label-font"
      >
        {{ treeNode.label }}
        <i
          [class]="treeNode.expanded ? 'las la-angle-up' : 'las la-angle-down'"
        ></i>
      </label>
    </li>
    <ul *ngIf="treeNode.expanded" class="pl-4">
      <ng-container *ngFor="let node of treeNode.children">
        <tree-node
          *ngIf="node.type === 'tree'"
          [treeNode]="node"
          [onToggle]="onToggle"
        ></tree-node>
        <leaf-node
          *ngIf="node.type === 'leaf'"
          [leafNode]="node"
          [onToggle]="onToggle"
        ></leaf-node>
      </ng-container>
    </ul>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 4px;
        width: 100%;

        .label-font {
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;

          color: var(--tertiary);
        }

        ul {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 4px;
        }
      }
      i {
        font-size: 12px;
        -webkit-text-stroke: 1px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent {
  @Input() treeNode!: CheckboxTreeNode;
  @Input() onToggle!: (node: CheckboxTreeItem) => void;

  disabled$ = this.store.disabled$;

  onChange(selected: boolean) {
    this.treeNode.state = selected ? 'checked' : 'unchecked';
    this.onToggle(this.treeNode);
  }

  /**
   * Add and remove the tree id in the store when it is toggled manually so the item is not collapsed every time
   * a checkbox is selected since since the filtered options will close any tree not in the store.
   */
  onToggleExpand() {
    if (this.treeNode.expanded) {
      this.store.removeExpandedItem(this.treeNode.value);
    } else {
      this.store.addExpandedItem(this.treeNode.value);
    }

    this.treeNode.expanded = !this.treeNode.expanded;
  }

  constructor(private store: BasicCheckboxTreeStore) {}
}
