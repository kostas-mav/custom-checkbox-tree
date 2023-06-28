export interface Neat {
  id: string;
  name: string;
  children?: Neat[];
}

export type CheckboxTreeBehavior = '2-state' | '3-state';

interface AbstractNode {
  type: 'tree' | 'leaf';
  label: string;
  value: string;
  state: 'checked' | 'unchecked' | 'intermediate';
  parent?: CheckboxTreeNode;
}

export interface CheckboxTreeNode extends AbstractNode {
  type: 'tree';
  state: 'checked' | 'unchecked' | 'intermediate';
  expanded: boolean;
  children: CheckboxTree;
}

export interface CheckboxLeafNode extends AbstractNode {
  type: 'leaf';
  state: 'checked' | 'unchecked';
}

export type CheckboxTree = (CheckboxTreeNode | CheckboxLeafNode)[];
export type CheckboxTreeItem = CheckboxTree[0];
