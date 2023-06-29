import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { BasicCheckboxTreeStore } from './data-access/basic-checkbox-tree.store';
import {
  applyControlValueToTree,
  extractControlValueFromTree,
} from './utils/control';
import { mapSourceToNodes } from './utils/map-source';
import {
  CheckboxTree,
  CheckboxTreeBehavior,
  CheckboxTreeItem,
  Neat,
} from './utils/types';
import {
  updateNodeSRelatives,
  updateTreeRelatives,
} from './utils/update-relatives';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { LeafNodeComponent } from './leaf-node.component';
import { TreeNodeComponent } from './tree-node.component';
import { ngCVAProvider } from '../utils/control-value-accessor-provider';

@Component({
  selector: 'cct-basic-checkbox-tree',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    LeafNodeComponent,
    TreeNodeComponent,
  ],
  template: `
    <ng-container *ngFor="let node of tree">
      <tree-node
        *ngIf="node.type === 'tree'"
        [treeNode]="node"
        [onToggle]="onToggle.bind(this)"
      ></tree-node>
      <leaf-node
        *ngIf="node.type === 'leaf'"
        [leafNode]="node"
        [onToggle]="onToggle.bind(this)"
      ></leaf-node>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 4px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ngCVAProvider(BasicCheckboxTreeComponent)],
})
export class BasicCheckboxTreeComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  // @Input({ required: true }) options!: Neat[];
  @Input() behavior: CheckboxTreeBehavior = '3-state';
  @Input() priorityItems: string[] = [];

  tree!: CheckboxTree;
  value: string[] = [];

  onToggle(node: CheckboxTreeItem) {
    if (this.behavior === '3-state') updateNodeSRelatives(node);
    this.store.setCheckedItems(
      extractControlValueFromTree(this.tree, this.behavior)
    );
    this.onChange(this.value);
    this.onTouch();
    this.changeDetectorRef.markForCheck();
  }

  /**
   * @description Allow Angular to set the value on the component. Is being
   * used from the controller to set the value and update Tree based on it.
   */
  writeValue(value: string[]): void {
    this.store.setCheckedItems(value);
    applyControlValueToTree(this.tree, this.value);
    if (this.behavior === '3-state') updateTreeRelatives(this.tree);
    this.changeDetectorRef.markForCheck();
  }
  /** @description Save a reference to the change function passed to us by the Angular form control */
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }
  /** @description Save a reference to the touched function passed to us by the Angular form control */
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.store.patchState({ disabled: isDisabled });
  }

  onChange = (value: string[]) => {};
  onTouch = () => {};

  constructor(
    private store: BasicCheckboxTreeStore,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    merge(
      this.store.checkedItems$.pipe(
        takeUntil(this._destroy$),
        tap((checkedItems) => (this.value = checkedItems))
      ),
      combineLatest([
        this.store.filteredOptions$,
        this.store.expandedItems$,
        this.store.checkedItems$,
      ]).pipe(
        takeUntil(this._destroy$),
        tap(([filteredOptions, expandedItems, checkedItems]) => {
          // Use this.options in case the component is used as a standalone
          this.tree = mapSourceToNodes(
            filteredOptions,
            expandedItems,
            checkedItems
          );
          this.tree.forEach((option, idx) => {
            if (this.priorityItems.includes(option.value)) {
              const unshiftedOption = option;
              this.tree.splice(idx, 1);
              this.tree.unshift(unshiftedOption);
            }
          });
          this.changeDetectorRef.detectChanges();
        })
      )
    ).subscribe();
  }

  private _destroy$ = new Subject();

  ngOnDestroy(): void {
    this._destroy$.next(null);
  }
}
