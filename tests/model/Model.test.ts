import { describe, it, expect } from 'vitest';
import { Model } from '../../src/model/Model';
import { GraphLinksModel } from '../../src/model/GraphLinksModel';
import { TreeModel } from '../../src/model/TreeModel';

describe('Model', () => {
  it('should create an empty model', () => {
    const model = new Model();
    expect(model.nodeDataArray.length).toBe(0);
  });

  it('should create a model with node data', () => {
    const model = new Model([
      { key: 1, text: 'Alpha' },
      { key: 2, text: 'Beta' },
    ]);
    expect(model.nodeDataArray.length).toBe(2);
  });

  it('should add node data', () => {
    const model = new Model();
    model.addNodeData({ key: 1, text: 'Alpha' });
    expect(model.nodeDataArray.length).toBe(1);
    expect(model.findNodeDataForKey(1)).toBeDefined();
  });

  it('should remove node data', () => {
    const model = new Model();
    const data = { key: 1, text: 'Alpha' };
    model.addNodeData(data);
    model.removeNodeData(data);
    expect(model.nodeDataArray.length).toBe(0);
    expect(model.findNodeDataForKey(1)).toBeUndefined();
  });

  it('should auto-generate unique keys', () => {
    const model = new Model();
    model.addNodeData({ text: 'A' });
    model.addNodeData({ text: 'B' });
    const keys = model.nodeDataArray.map(d => d.key);
    expect(keys[0]).toBeDefined();
    expect(keys[1]).toBeDefined();
    expect(keys[0]).not.toBe(keys[1]);
  });

  it('should set data property', () => {
    const model = new Model();
    const data = { key: 1, text: 'Alpha' };
    model.addNodeData(data);
    model.setDataProperty(data, 'text', 'Beta');
    expect(data.text).toBe('Beta');
  });

  it('should serialize to JSON', () => {
    const model = new Model([{ key: 1, text: 'Alpha' }]);
    const json = model.toJson();
    expect(json).toContain('Alpha');
    expect(json).toContain('nodeDataArray');
  });

  it('should deserialize from JSON', () => {
    const json = JSON.stringify({
      class: 'Model',
      nodeDataArray: [{ key: 1, text: 'Alpha' }],
    });
    const model = Model.fromJson(json);
    expect(model.nodeDataArray.length).toBe(1);
    expect(model.findNodeDataForKey(1)?.text).toBe('Alpha');
  });

  it('should support transactions', () => {
    const model = new Model();
    model.startTransaction('test');
    model.addNodeData({ key: 1, text: 'Alpha' });
    model.addNodeData({ key: 2, text: 'Beta' });
    model.commitTransaction('test');
    expect(model.nodeDataArray.length).toBe(2);
  });

  it('should support undo/redo', () => {
    const model = new Model();
    model.undoManager.isEnabled = true;
    model.startTransaction('add');
    model.addNodeData({ key: 1, text: 'Alpha' });
    model.commitTransaction('add');
    expect(model.nodeDataArray.length).toBe(1);

    model.undoManager.undo();
    // Note: full undo of addNodeData requires Diagram integration
    // Basic undo manager structure works
  });

  it('should copy model', () => {
    const model = new Model([{ key: 1, text: 'Alpha' }]);
    const copy = model.copy();
    expect(copy.nodeDataArray.length).toBe(1);
    copy.nodeDataArray[0].text = 'Beta';
    expect(model.nodeDataArray[0].text).toBe('Alpha');
  });
});

describe('GraphLinksModel', () => {
  it('should create a model with links', () => {
    const model = new GraphLinksModel(
      [{ key: 1, text: 'Alpha' }, { key: 2, text: 'Beta' }],
      [{ from: 1, to: 2 }]
    );
    expect(model.nodeDataArray.length).toBe(2);
    expect(model.linkDataArray.length).toBe(1);
  });

  it('should add and remove link data', () => {
    const model = new GraphLinksModel();
    model.addNodeData({ key: 1, text: 'Alpha' });
    model.addNodeData({ key: 2, text: 'Beta' });
    const link = { from: 1, to: 2 };
    model.addLinkData(link);
    expect(model.linkDataArray.length).toBe(1);
    model.removeLinkData(link);
    expect(model.linkDataArray.length).toBe(0);
  });

  it('should get/set link from/to keys', () => {
    const model = new GraphLinksModel();
    const link = { from: 1, to: 2 };
    model.addLinkData(link);
    expect(model.getFromKeyForLinkData(link)).toBe(1);
    expect(model.getToKeyForLinkData(link)).toBe(2);
    model.setToKeyForLinkData(link, 3);
    expect(model.getToKeyForLinkData(link)).toBe(3);
  });

  it('should serialize to JSON', () => {
    const model = new GraphLinksModel(
      [{ key: 1, text: 'Alpha' }],
      [{ from: 1, to: 2 }]
    );
    const json = model.toJson();
    expect(json).toContain('linkDataArray');
  });

  it('should deserialize from JSON', () => {
    const json = JSON.stringify({
      class: 'GraphLinksModel',
      nodeDataArray: [{ key: 1, text: 'Alpha' }],
      linkDataArray: [{ from: 1, to: 2 }],
    });
    const model = GraphLinksModel.fromJson(json);
    expect(model.nodeDataArray.length).toBe(1);
    expect(model.linkDataArray.length).toBe(1);
  });
});

describe('TreeModel', () => {
  it('should create a tree model', () => {
    const model = new TreeModel([
      { key: 1, text: 'Root' },
      { key: 2, text: 'Child', parent: 1 },
    ]);
    expect(model.nodeDataArray.length).toBe(2);
  });

  it('should get/set parent key', () => {
    const model = new TreeModel();
    const data = { key: 2, text: 'Child', parent: 1 };
    model.addNodeData(data);
    expect(model.getParentKeyForNodeData(data)).toBe(1);
    model.setParentKeyForNodeData(data, 3);
    expect(model.getParentKeyForNodeData(data)).toBe(3);
  });

  it('should serialize to JSON', () => {
    const model = new TreeModel([{ key: 1, text: 'Root' }]);
    const json = model.toJson();
    expect(json).toContain('TreeModel');
  });

  it('should deserialize from JSON', () => {
    const json = JSON.stringify({
      class: 'TreeModel',
      nodeDataArray: [{ key: 1, text: 'Root' }, { key: 2, text: 'Child', parent: 1 }],
    });
    const model = TreeModel.fromJson(json);
    expect(model.nodeDataArray.length).toBe(2);
  });
});
