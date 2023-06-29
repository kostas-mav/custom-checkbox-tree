import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicCheckboxTreeComponent } from 'src/app/shared/checkbox-tree/basic-checkbox-tree.component';
import { BasicCheckboxTreeStore } from 'src/app/shared/checkbox-tree/data-access/basic-checkbox-tree.store';
import {
  CheckboxTreeBehavior,
  Neat,
} from 'src/app/shared/checkbox-tree/utils/types';
import { InputLabelComponent } from 'src/app/shared/input-label/input-label.component';
import { ngCVAProvider } from 'src/app/shared/utils/control-value-accessor-provider';
import {
  ControlValueAccessor,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Observable,
  Subject,
  combineLatest,
  filter,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  getCheckedItemsByAvailableOptions,
  getCheckedOptions,
} from 'src/app/shared/checkbox-tree/utils/filtering-functions';

interface ViewModel {
  filteredOptions: Neat[];
  checkedItems: string[];
}

@Component({
  selector: 'cct-checkbox-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicCheckboxTreeComponent,
    InputLabelComponent,
  ],
  providers: [ngCVAProvider(CheckboxTreeComponent), BasicCheckboxTreeStore],
  template: `
    <ng-container *ngIf="viewModel$ | async as vm">
      <cct-input-label *ngIf="label">{{ label }}</cct-input-label>

      <cct-basic-checkbox-tree
        [formControl]="control"
        [behavior]="behavior"
      ></cct-basic-checkbox-tree>

      <button
        class="flex justify-start items-center gap-2 text-sm"
        *ngIf="options.length > showMoreLimit && !containerExpanded"
        (click)="expandContainer()"
      >
        <i class="las la-plus"></i>
        <span>Show More ({{ options.length - showMoreLimit }})</span>
      </button>

      <button
        class="flex justify-start items-center gap-2 text-sm"
        *ngIf="options.length > showMoreLimit && containerExpanded"
        (click)="collapseContainer(vm.checkedItems)"
      >
        <i class="las la-minus"></i>
        <span>Show Less</span>
      </button>
    </ng-container>
  `,
})
export class CheckboxTreeComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input({ required: true }) options!: Neat[];
  @Input({ required: true }) behavior!: CheckboxTreeBehavior;
  @Input() label!: string;
  @Input() control: FormControl<string[]> = this.fb.control([]);

  readonly showMoreLimit = 8;
  containerExpanded: boolean = false;

  viewModel$: Observable<ViewModel> = combineLatest({
    filteredOptions: this.store.filteredOptions$,
    checkedItems: this.store.checkedItems$,
  });

  writeValue(value: string[]): void {
    if (value.length && !this.containerExpanded) this.expandContainer();
    this.control.setValue(value || [], { emitEvent: false });
    this.store.setCheckedItems(
      getCheckedItemsByAvailableOptions(this.options, value)
    );
  }
  /** @description Save a reference to the change function passed to us by the Angular form control */
  registerOnChange(fn: (value: string[]) => void): void {
    this.control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(fn);
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

  ngOnInit(): void {}

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

  private _destroy$ = new Subject();

  ngOnDestroy(): void {
    this._destroy$.next(null);
  }
}
