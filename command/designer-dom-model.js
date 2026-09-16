(() => {
  'use strict';

  const clone = value => JSON.parse(JSON.stringify(value));

  function createModel(nodes) {
    const model = { version: 1, nodes: {}, root: null };
    (Array.isArray(nodes) ? nodes : []).forEach(node => {
      if (!node || typeof node.id !== 'string') throw new Error('INVALID_NODE');
      if (model.nodes[node.id]) throw new Error('DUPLICATE_NODE');
      model.nodes[node.id] = {
        id: node.id,
        parent: node.parent == null ? null : String(node.parent),
        tag: String(node.tag || 'div').toLowerCase(),
        children: Array.isArray(node.children) ? node.children.map(String) : []
      };
    });
    const roots = Object.values(model.nodes).filter(node => node.parent === null);
    if (roots.length > 1) throw new Error('MULTIPLE_ROOTS');
    model.root = roots[0]?.id || null;
    validateModel(model);
    return model;
  }

  function validateModel(model) {
    const nodes = model.nodes || {};
    for (const node of Object.values(nodes)) {
      if (node.parent !== null) {
        if (!nodes[node.parent]) throw new Error('MISSING_PARENT');
        if (!nodes[node.parent].children.includes(node.id)) throw new Error('PARENT_CHILD_MISMATCH');
      }
      const seen = new Set();
      for (const child of node.children) {
        if (seen.has(child)) throw new Error('DUPLICATE_CHILD');
        seen.add(child);
        if (!nodes[child] || nodes[child].parent !== node.id) throw new Error('CHILD_PARENT_MISMATCH');
      }
    }
    for (const id of Object.keys(nodes)) {
      const seen = new Set();
      let current = id;
      while (current !== null) {
        if (seen.has(current)) throw new Error('CYCLE');
        seen.add(current);
        current = nodes[current]?.parent ?? null;
      }
    }
    return model;
  }

  function childrenOf(model, parent) {
    const node = model.nodes[parent];
    return node ? node.children.map(id => model.nodes[id]).filter(Boolean) : [];
  }

  function canMove(model, element, parent) {
    if (!model.nodes[element]) return false;
    if (parent !== null && !model.nodes[parent]) return false;
    if (element === parent) return false;
    let current = parent;
    while (current !== null) {
      if (current === element) return false;
      current = model.nodes[current]?.parent ?? null;
    }
    return true;
  }

  function applyMove(model, element, parent, position = 'inside', index = null) {
    if (!canMove(model, element, parent)) throw new Error('INVALID_MOVE');
    if (!['inside', 'before', 'after'].includes(position)) throw new Error('INVALID_POSITION');
    const target = model.nodes[element];
    let newParent = parent;
    let insertIndex = index;
    if (position !== 'inside') {
      const targetNode = model.nodes[parent];
      if (!targetNode || targetNode.parent === null) throw new Error('INVALID_SIBLING_TARGET');
      newParent = targetNode.parent;
      const siblings = model.nodes[newParent].children;
      const targetIndex = siblings.indexOf(parent);
      insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
    }
    const oldParent = target.parent;
    if (oldParent !== null && model.nodes[oldParent]) {
      model.nodes[oldParent].children = model.nodes[oldParent].children.filter(id => id !== element);
    }
    target.parent = newParent;
    if (newParent !== null) {
      const siblings = model.nodes[newParent].children.filter(id => id !== element);
      const safeIndex = insertIndex == null ? siblings.length : Math.max(0, Math.min(Number(insertIndex), siblings.length));
      siblings.splice(safeIndex, 0, element);
      model.nodes[newParent].children = siblings;
    }
    validateModel(model);
    return model;
  }

  function serializeOperations(model) {
    const operations = [];
    for (const node of Object.values(model.nodes)) {
      operations.push({ op: 'place', element: node.id, parent: node.parent, index: node.parent === null ? 0 : model.nodes[node.parent].children.indexOf(node.id) });
    }
    return clone(operations);
  }

  const api = { version: 1, createModel, childrenOf, canMove, applyMove, serializeOperations, validateModel };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.LSDesignerDomModel = api;
})();
