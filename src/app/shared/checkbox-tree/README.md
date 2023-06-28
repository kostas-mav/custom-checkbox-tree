## Usage notes:

`<iams-checkbox-tree formControlName="users" [options]="usersSource"> </iams-checkbox-tree>`

**@Input() options:** {id: string; name: string; children?: options} [ ]: \
  A source of options to be mapped into a checkbox-tree.
   \
**@Input() behavior:** '2-state' \| '3-state': \
  2-state behavior: select a tree node and only that is checked.
  3-state behavior: select a tree node, you select all its descendants and update its ascendants.

## Docs:
### Basic Functions:
**writeValue():** is being used from angular (forms etc.) to update value. We hook to that to update our tree with the new value. \
**onToggle:** is being used from inside the checkbox-tree to update controllers value. It can be called from any tree-node.


**Versions of this component for separate usage in both form editors and dashboard filters have been created and added respectively to the
editor-page and dashboard-page inputs in the 'src/app/shared/ui/components' directory.**
