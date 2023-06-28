import { CheckboxTree, CheckboxTreeBehavior } from './types';

// Apply control value to checkbox-tree
export function applyControlValueToTree(
  tree: CheckboxTree,
  value: string[]
): CheckboxTree {
  function fn(tree: CheckboxTree, value: string[]) {
    tree.forEach((node) => {
      if (node.type === 'tree') fn(node.children, value);
      node.state = value.includes(node.value) ? 'checked' : 'unchecked';
    });
  }
  fn(tree, value);
  return tree;
}

// Extract control value from checkbox-tree
export function extractControlValueFromTree(
  tree: CheckboxTree,
  behavior: CheckboxTreeBehavior
): string[] {
  const value: string[] = [];
  function fn(tree: CheckboxTree, value: string[]) {
    tree.forEach((node) => {
      if (node.type === 'tree') fn(node.children, value);
      if (node.state === 'checked') {
        // Here you can decide which selected values you want i.e.
        // only leaf nodes or all nodes?
        if (behavior === '2-state') value.push(node.value);
        if (behavior === '3-state' && node.type === 'leaf')
          value.push(node.value);
      }
    });
  }
  fn(tree, value);
  return value;
}
