import {
  CheckboxTreeNode,
  CheckboxTree,
  CheckboxTreeItem,
  Neat,
} from './types';

/**
 * @param {Neat[]}source
 * @returns Source formatted as Nodes {type: string, label: string, parent?: CheckboxTree, children?: CheckboxTree}.
 */
export function mapSourceToNodes(
  source: Neat[],
  expandedItems: string[],
  checkedItems: string[]
): CheckboxTree {
  const tree = mapSourceToNodesWithoutParent(
    source,
    expandedItems,
    checkedItems
  );
  addParents(tree);
  return tree;
}

/**
 * @param {Neat[]}source
 * @returns Source formatted as Nodes without the "parent" property.
 */
function mapSourceToNodesWithoutParent(
  source: Neat[],
  expandedItems: string[],
  checkedItems: string[]
): CheckboxTree {
  function toNode(source: Neat): CheckboxTreeItem {
    let childNodes!: CheckboxTree;
    if (source.children)
      childNodes = mapSourceToNodesWithoutParent(
        source.children,
        expandedItems,
        checkedItems
      );

    // You can extend the tree-node and leaf-node interface from here.
    // e.g. add "value", "selected" & "expanded" properties.
    if (childNodes) {
      return {
        type: 'tree',
        label: source.name,
        value: source.id,
        state: getTreeStateByCheckedItems(childNodes),
        expanded: expandedItems.includes(source.id),
        children: childNodes, //.sort((a, b) => (a.state > b.state ? 1 : -1)),
      };
    } else {
      return {
        type: 'leaf',
        label: source.name,
        value: source.id,
        state: checkedItems.includes(source.id) ? 'checked' : 'unchecked',
      };
    }
  }
  return source.map((sourceItem) => toNode(sourceItem));
}

function getTreeStateByCheckedItems(
  childNodes: CheckboxTree
): CheckboxTreeNode['state'] {
  let state: CheckboxTreeNode['state'] = 'unchecked';

  const checkedItemCount: number = childNodes.filter(
    (node) => node.state === 'checked'
  ).length;

  const intermediateItemCount: number = childNodes.filter(
    (node) => node.state === 'intermediate'
  ).length;

  if (checkedItemCount === 0 && intermediateItemCount === 0) {
    state = 'unchecked';
  } else if (
    checkedItemCount === childNodes.length &&
    intermediateItemCount === 0
  ) {
    state = 'checked';
  } else {
    state = 'intermediate';
  }

  return state;
}

function addParents(tree: CheckboxTree): void {
  function addParent(
    node: CheckboxTreeItem,
    parent: CheckboxTreeNode | undefined = undefined
  ) {
    if (node.type === 'tree')
      node.children.forEach((child) => addParent(child, node));
    if (parent) node.parent = parent;
  }
  tree.forEach((item) => addParent(item));
}
