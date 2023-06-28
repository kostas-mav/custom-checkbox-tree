import { Neat } from './types';

/**
 * Returns an array of `Neat[]` options with all the items from their last nested level that include
 * the `query`. Also any currently checked items.
 */
export function filterOptionsByName(
  options: Neat[],
  query: string,
  checkedItems: string[]
): Neat[] {
  const filteredOptions: Neat[] = [];

  for (const option of options) {
    if (option.children) {
      const filteredChildren = filterOptionsByName(
        option.children,
        query,
        checkedItems
      );
      if (filteredChildren.length > 0) {
        filteredOptions.push({
          id: option.id,
          name: option.name,
          children: filteredChildren,
        });
      }
    } else {
      if (
        option.name.toLowerCase().includes(query.toLowerCase()) ||
        checkedItems.includes(option.id)
      ) {
        filteredOptions.push({
          id: option.id,
          name: option.name,
        });
      }
    }
  }

  return filteredOptions;
}

/**
 * Returns an array of `Neat[]` options that they themselves are checked or have one of their nested items checked.
 */
export function getCheckedOptions(
  options: Neat[],
  checkedItems: string[]
): Neat[] {
  const checkedOptions: Neat[] = [];

  options.forEach((option) => {
    if (option.children) {
      const checkedChildren: Neat[] = getCheckedOptions(
        option.children,
        checkedItems
      );
      if (checkedChildren.length) {
        checkedOptions.push({
          id: option.id,
          name: option.name,
          children: option.children,
        });
      }
    } else {
      if (checkedItems.includes(option.id))
        checkedOptions.push({
          id: option.id,
          name: option.name,
          children: option.children,
        });
    }
  });

  return checkedOptions;
}

/**
 * Returns an array of ids of all trees that include a currently checked item.
 */
export function getExpandedItems(options: Neat[]) {
  const expandedItems: string[] = [];

  options.forEach((option) => {
    if (option.children) {
      const expandedChildren = getExpandedItems(option.children);
      expandedItems.push(option.id, ...expandedChildren);
    }
  });

  return expandedItems;
}

export function getCheckedItemsByAvailableOptions(
  options: Neat[],
  value: string[]
): string[] {
  let validOptionIds: string[] = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.children) {
      const validChildrenIds = getCheckedItemsByAvailableOptions(
        option.children,
        value
      );
      if (validChildrenIds.length) validOptionIds.push(...validChildrenIds);
    } else {
      if (value.includes(option.id)) validOptionIds.push(option.id);
    }
  }

  return validOptionIds;
}
