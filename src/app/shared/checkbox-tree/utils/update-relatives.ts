import { CheckboxTree, CheckboxTreeItem, CheckboxTreeNode } from './types';

/**
 * @description updates should be done from the top of the tree to the bottom. If a node
 * is selected, it should first affect all its descendants and then update ascendants.
 */

export function updateTreeRelatives(tree: CheckboxTree) {
  function fn(tree: CheckboxTree) {
    tree.forEach((node) => {
      if (node.state === 'checked') updateNodeSRelatives(node);
      if (node.type === 'tree') fn(node.children);
    });
  }
  fn(tree);
}

export function updateNodeSRelatives(node: CheckboxTreeItem) {
  updateDescendants(node);
  updateAscendants(node);
}

function updateDescendants(node: CheckboxTreeItem) {
  function fn(node: CheckboxTreeItem) {
    if (node.type !== 'tree') return;
    node.children.forEach(
      (el) => (el.state = node.state === 'checked' ? 'checked' : 'unchecked')
    );
    node.children.forEach((item) => fn(item));
  }
  fn(node);
}

function updateAscendants(node: CheckboxTreeItem) {
  function fn(node: CheckboxTreeItem) {
    if (!node.parent) return;
    calculateParentSState(node.parent);
    fn(node.parent);
  }
  fn(node);
}

function calculateParentSState(treeNode: CheckboxTreeNode): void {
  const childrenInclude: {
    [key in CheckboxTreeItem['state']]: number;
  } = {
    checked: 0,
    unchecked: 0,
    intermediate: 0,
  };
  treeNode.children.forEach((treeItem) => childrenInclude[treeItem.state]++);
  if (
    childrenInclude.intermediate ||
    (childrenInclude.checked && childrenInclude.unchecked)
  ) {
    treeNode.state = 'intermediate';
  } else if (!childrenInclude.checked) {
    treeNode.state = 'unchecked';
  } else {
    treeNode.state = 'checked';
  }
}
