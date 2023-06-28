import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Neat } from '../utils/types';

@Injectable()
export class BasicCheckboxTreeStore extends ComponentStore<{
  disabled: boolean;
  options: Neat[];
  filteredOptions: Neat[];
  checkedItems: string[];
  expandedItems: string[];
}> {
  readonly disabled$ = this.select((state) => state.disabled);
  readonly options$ = this.select((state) => state.options);
  readonly filteredOptions$ = this.select((state) => state.filteredOptions);
  readonly checkedItems$ = this.select((state) => state.checkedItems);
  readonly expandedItems$ = this.select((state) => state.expandedItems);

  readonly allAvailableItemIds$ = this.options$.pipe(
    map((options) => this._getAllAvailableOptionIds(options))
  );

  readonly checkedTreeNodeChips$ = this.checkedItems$.pipe(
    withLatestFrom(this.options$),
    map(([checkedItems, options]) => {
      const labels: Neat[] = this._getCheckedTreeNodeChips(
        checkedItems,
        options
      );

      return labels;
    })
  );

  readonly checkedItemChips$ = this.checkedItems$.pipe(
    withLatestFrom(this.options$),
    map(([checkedItems, options]) => {
      const labels: Neat[] = this._getCheckedItemChips(checkedItems, options);

      return labels;
    })
  );

  constructor() {
    super({
      disabled: false,
      options: [],
      filteredOptions: [],
      checkedItems: [],
      expandedItems: [],
    });
  }

  setOptions = this.effect((options$: Observable<Neat[]>) =>
    options$.pipe(
      tap((options) => {
        this.patchState({ options });
      })
    )
  );

  setFilteredOptions = this.effect((filteredOptions$: Observable<Neat[]>) =>
    filteredOptions$.pipe(
      tap((filteredOptions) => {
        this.patchState({ filteredOptions });
      })
    )
  );

  setCheckedItems = this.effect((checkedItems$: Observable<string[]>) =>
    checkedItems$.pipe(
      tap((checkedItems) => {
        this.patchState({ checkedItems });
      })
    )
  );

  removeCheckedItem = this.effect((item: Observable<string>) =>
    item.pipe(
      withLatestFrom(this.checkedItems$),
      tap(([item, checkedItems]) => {
        let newItems = structuredClone(checkedItems);
        for (let idx = 0; idx < newItems.length; idx++) {
          const removedItem = newItems[idx];
          if (removedItem === item) {
            newItems.splice(idx, 1);
            break;
          }
        }
        this.patchState({ checkedItems: newItems });
      })
    )
  );

  setExpandedItems = this.effect((expandedItems$: Observable<string[]>) =>
    expandedItems$.pipe(
      tap((expandedItems) => {
        this.patchState({ expandedItems });
      })
    )
  );

  addExpandedItem = this.effect((item: Observable<string>) =>
    item.pipe(
      withLatestFrom(this.expandedItems$),
      tap(([item, expandedItems]) => {
        let newItems = [...expandedItems, item];
        this.patchState({ expandedItems: newItems });
      })
    )
  );

  removeExpandedItem = this.effect((item: Observable<string>) =>
    item.pipe(
      withLatestFrom(this.expandedItems$),
      tap(([item, expandedItems]) => {
        let newItems = expandedItems;
        for (let index = 0; index < newItems.length; index++) {
          const removedItem = newItems[index];
          if (removedItem === item) {
            newItems.splice(index, 1);
            break;
          }
        }
        this.patchState({ expandedItems: newItems });
      })
    )
  );

  private _getCheckedTreeNodeChips(
    checkedItems: string[],
    options: Neat[]
  ): Neat[] {
    let labels: Neat[] = [];

    options.forEach((option) => {
      if (option.children) {
        const checkedChildrenChips = this._getCheckedTreeNodeChips(
          checkedItems,
          option.children
        );
        if (checkedChildrenChips.length) {
          if (checkedChildrenChips.length < option.children.length) {
            labels.push(...checkedChildrenChips);
          } else {
            labels.push({
              id: option.id,
              name: option.name,
              children: checkedChildrenChips,
            });
          }
        }
      } else {
        if (checkedItems.includes(option.id))
          labels.push({ id: option.id, name: option.name });
      }
    });

    return labels;
  }

  private _getCheckedItemChips(
    checkedItems: string[],
    options: Neat[]
  ): Neat[] {
    let labels: Neat[] = [];

    options.forEach((option) => {
      if (option.children) {
        const checkedChildrenChips = this._getCheckedItemChips(
          checkedItems,
          option.children
        );
        if (checkedChildrenChips.length) labels.push(...checkedChildrenChips);
      } else {
        if (checkedItems.includes(option.id))
          labels.push({ id: option.id, name: option.name });
      }
    });

    return labels;
  }

  private _getAllAvailableOptionIds(options: Neat[]): string[] {
    const availableOptions: string[] = [];

    options.forEach((option) => {
      if (option.children) {
        const childOptions = this._getAllAvailableOptionIds(option.children);
        if (childOptions.length) availableOptions.push(...childOptions);
      } else {
        availableOptions.push(option.id);
      }
    });

    return availableOptions;
  }
}
