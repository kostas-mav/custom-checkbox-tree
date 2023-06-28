import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as MockSource from 'src/app/shared/checkbox-tree/utils/source.json';
import { Neat } from './shared/checkbox-tree/utils/types';

const mockSource: Neat[] = MockSource;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly options = mockSource;
}
