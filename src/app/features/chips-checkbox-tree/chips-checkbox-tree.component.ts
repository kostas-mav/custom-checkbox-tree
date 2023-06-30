import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { BasicCheckboxTreeComponent } from 'src/app/shared/checkbox-tree/basic-checkbox-tree.component';
import { TextInputComponent } from 'src/app/shared/text-input/text-input.component';
import { InputLabelComponent } from 'src/app/shared/input-label/input-label.component';
import { ChipComponent } from 'src/app/shared/chip/chip.component';
import { BasicCheckboxTreeStore } from 'src/app/shared/checkbox-tree/data-access/basic-checkbox-tree.store';
import {
  CheckboxTreeBehavior,
  Neat,
} from 'src/app/shared/checkbox-tree/utils/types';
import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  filterOptionsByName,
  getCheckedItemsByAvailableOptions,
  getCheckedOptions,
  getExpandedItems,
} from 'src/app/shared/checkbox-tree/utils/filtering-functions';
import { ngCVAProvider } from 'src/app/shared/utils/control-value-accessor-provider';

interface ViewModel {
  filteredOptions: Neat[];
  checkedItems: string[];
  checkedTreeNodeChips: Neat[];
  checkedItemChips: Neat[];
  allAvailableItemIds: string[];
}

@Component({
  selector: 'cct-chips-checkbox-tree',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicCheckboxTreeComponent,
    TextInputComponent,
    InputLabelComponent,
    ChipComponent,
  ],
  providers: [
    ngCVAProvider(ChipsCheckboxTreeComponent),
    BasicCheckboxTreeStore,
  ],
  templateUrl: './chips-checkbox-tree.component.html',
  styleUrls: ['./chips-checkbox-tree.component.scss'],
})
export class ChipsCheckboxTreeComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input({ required: true }) behavior: CheckboxTreeBehavior = '3-state';
  @Input({ required: true }) options!: Neat[];
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() allSelectedLabel: string = 'All';
  /**
   * `string` ids that will be compared with all items in the options and if
   * they match with any they will be moved to the top of their respective tree.
   */
  @Input() priorityItems: string[] = [];
  @Input() set enableParentChips(val: '' | boolean) {
    if (typeof val === 'string') {
      this.parentChipsEnabled = true;
    } else {
      this.parentChipsEnabled = val;
    }
  }
  @Input() set disableDelete(val: '' | boolean) {
    if (typeof val === 'string') {
      this.deleteEnabled = false;
    } else {
      this.deleteEnabled = val;
    }
  }

  parentChipsEnabled: boolean = false;
  deleteEnabled: boolean = true;

  readonly showMoreLimit = 8;
  containerExpanded: boolean = false;

  viewModel$: Observable<ViewModel> = combineLatest({
    filteredOptions: this.store.filteredOptions$,
    checkedItems: this.store.checkedItems$,
    checkedTreeNodeChips: this.store.checkedTreeNodeChips$,
    checkedItemChips: this.store.checkedItemChips$,
    allAvailableItemIds: this.store.allAvailableItemIds$,
  });

  valueControl: FormControl<string[]> = this.fb.control([]);
  searchControl = this.fb.control('');

  onRemove(item: Neat) {
    if (item.children) {
      item.children.forEach((child) => this.onRemove(child));
    } else {
      (this.valueControl.value as string[]).forEach(
        (checkedItem: string, idx: number) => {
          if (checkedItem === item.id) {
            this.store.removeCheckedItem(item.id);
            (this.valueControl.value as string[]).splice(idx, 1);
            this.valueControl.updateValueAndValidity();
          }
        }
      );
    }
  }

  onClearAll() {
    this.store.setCheckedItems([]);
    (this.valueControl.value as string[]).splice(0);
    this.valueControl.updateValueAndValidity();
  }

  writeValue(value: string[]): void {
    if (value.length && !this.containerExpanded) this.expandContainer();
    this.valueControl.setValue(value || [], { emitEvent: false });
    // this.store.setCheckedItems(value);
    this.store.setCheckedItems(
      getCheckedItemsByAvailableOptions(this.options, value)
    );
  }
  /** @description Save a reference to the change function passed to us by the Angular form control */
  registerOnChange(fn: (value: string[]) => void): void {
    this.valueControl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(fn);
  }
  /** @description Save a reference to the touched function passed to us by the Angular form control */
  registerOnTouched(fn: () => void): void {
    fn = this.onTouch;
  }
  setDisabledState(isDisabled: boolean): void {
    this.store.patchState({ disabled: isDisabled });
  }

  onChange = (value: string[]) => {};
  onTouch = () => {};

  expandContainer() {
    this.store.setFilteredOptions(this.options);
    this.containerExpanded = true;
  }

  collapseContainer(checkedItems: string[]) {
    this.store.setFilteredOptions([
      ...this.options.slice(0, this.showMoreLimit),
      ...getCheckedOptions(
        this.options.slice(this.showMoreLimit),
        checkedItems
      ),
    ]);
    this.store.setExpandedItems([]);
    this.containerExpanded = false;
  }

  constructor(
    private store: BasicCheckboxTreeStore,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        withLatestFrom(this.store.options$, this.store.checkedItems$),
        tap(([query, options, checkedItems]) => {
          if (query.trim().length > 0) {
            const newOptions = filterOptionsByName(
              options,
              query,
              checkedItems
            );

            this.store.setFilteredOptions(newOptions);
            this.store.setExpandedItems(getExpandedItems(newOptions));
          } else {
            this.store.setExpandedItems([]);
            this.store.setFilteredOptions(options);
            if (checkedItems.length) {
              this.containerExpanded = true;
            }
          }
        })
      )
      .subscribe();
  }

  // Called when the `@Input() options` value changes to update the store. Most likely only once.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.store.setOptions(this.options);
      this.store.setFilteredOptions(this.options.slice(0, this.showMoreLimit));
      this.store.setCheckedItems([]);
      this.store.setExpandedItems([]);
    }
  }

  private _destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
