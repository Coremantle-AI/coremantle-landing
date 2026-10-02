import { Children, isValidElement } from 'react';

/** Plain text of a React node tree - the equivalent of DOM `textContent`. */
export function textContent(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (isValidElement(node)) return Children.toArray(node.props.children).map(textContent).join('');
  return '';
}
