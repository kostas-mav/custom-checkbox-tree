import { Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export function ngCVAProvider(component: any): Provider {
  return {
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: component,
  };
}
