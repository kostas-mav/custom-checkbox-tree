import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { BasicCheckboxTreeComponent } from 'src/app/shared/checkbox-tree/basic-checkbox-tree.component';
import { ngCVAProvider } from 'src/app/shared/utils/control-value-accessor-provider';
import { BasicCheckboxTreeStore } from 'src/app/shared/checkbox-tree/data-access/basic-checkbox-tree.store';
import {
  CheckboxTreeBehavior,
  Neat,
} from 'src/app/shared/checkbox-tree/utils/types';
import {
  Observable,
  Subject,
  combineLatest,
  filter,
  take,
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
import { InputLabelComponent } from 'src/app/shared/input-label/input-label.component';
import { TextInputComponent } from 'src/app/shared/text-input/text-input.component';

interface ViewModel {
  filteredOptions: Neat[];
  checkedItems: string[];
}

@Component({
  selector: 'cct-search-checkbox-tree',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicCheckboxTreeComponent,
    InputLabelComponent,
    TextInputComponent
  ],
  providers: [
    ngCVAProvider(SearchCheckboxTreeComponent),
    BasicCheckboxTreeStore,
  ],
  templateUrl: './search-checkbox-tree.component.html',
  styleUrls: ['./search-checkbox-tree.component.scss'],
})
export class SearchCheckboxTreeComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  private fb = inject(NonNullableFormBuilder);
  private store = inject(BasicCheckboxTreeStore);

  @Input({ required: true }) options!: Neat[];
  @Input({ required: true }) behavior: CheckboxTreeBehavior = '3-state';
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() priorityItems: string[] = [];

  readonly showMoreLimit = 8;
  containerExpanded: boolean = false;

  valueControl: FormControl<string[]> = this.fb.control([]);
  searchControl = this.fb.control('');

  viewModel$: Observable<ViewModel> = combineLatest({
    filteredOptions: this.store.filteredOptions$,
    checkedItems: this.store.checkedItems$,
  });

  writeValue(value: string[]): void {
    if (value.length && !this.containerExpanded) this.expandContainer();
    this.valueControl.setValue(value || [], { emitEvent: false });
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

  // Called when the `@Input() options` value changes to update the store. Most likely only once.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.store.options$
        .pipe(
          take(1),
          filter((options) => !options.length),
          tap(() => {
            this.store.setOptions(this.options);
            this.store.setFilteredOptions(
              this.options.slice(0, this.showMoreLimit)
            );
            this.store.setCheckedItems([]);
            this.store.setExpandedItems([]);
          })
        )
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        withLatestFrom(this.store.options$, this.store.checkedItems$),
        tap(([query, options, checkedItems]) => {
          console.log(query);
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

  private _destroy$ = new Subject();

  ngOnDestroy(): void {
    this._destroy$.next(null);
  }
}
