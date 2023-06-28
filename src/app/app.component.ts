import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { default as MockSource } from 'src/app/shared/checkbox-tree/utils/source.json';
import { Neat } from './shared/checkbox-tree/utils/types';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BasicCheckboxTreeComponent } from './shared/checkbox-tree/basic-checkbox-tree.component';

const mockSource: Neat[] = MockSource;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BasicCheckboxTreeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private fb: NonNullableFormBuilder) {}

  readonly options = mockSource;

  form = this.fb.group({
    tree: [[]],
  });

  ngOnInit(): void {}
}
