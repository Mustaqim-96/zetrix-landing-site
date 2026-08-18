import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const glbPath = path.join(projectRoot, 'assets/3d/zetrix-blockchain-cube-v1.glb');
const manifestPath = path.join(projectRoot, 'assets/3d/zetrix-blockchain-cube-v1-manifest.json');

function parseGlb(buffer) {
  assert.equal(buffer.readUInt32LE(0), 0x46546c67, 'GLB magic must be glTF');
  assert.equal(buffer.readUInt32LE(4), 2, 'GLB version must be 2');
  assert.equal(buffer.readUInt32LE(8), buffer.length, 'GLB declared length must match file');

  let offset = 12;
  const chunks = [];
  while (offset < buffer.length) {
    const byteLength = buffer.readUInt32LE(offset);
    const type = buffer.readUInt32LE(offset + 4);
    const data = buffer.subarray(offset + 8, offset + 8 + byteLength);
    chunks.push({ type, data });
    offset += 8 + byteLength;
  }

  assert.equal(offset, buffer.length, 'chunks must fill the GLB exactly');
  assert.equal(chunks.length, 2, 'GLB must contain JSON and BIN chunks');
  assert.equal(chunks[0].type, 0x4e4f534a, 'first chunk must be JSON');
  assert.equal(chunks[1].type, 0x004e4942, 'second chunk must be BIN');

  return {
    json: JSON.parse(chunks[0].data.toString('utf8').trim()),
    bin: chunks[1].data,
  };
}

function collectDescendants(gltf, rootIndex) {
  const result = new Set();
  const visit = (index) => {
    if (result.has(index)) return;
    result.add(index);
    for (const child of gltf.nodes[index].children ?? []) visit(child);
  };
  visit(rootIndex);
  return result;
}

test('exports the approved self-contained Zetrix blockchain cube contract', async () => {
  const [glb, manifestBuffer] = await Promise.all([
    readFile(glbPath),
    readFile(manifestPath),
  ]);
  const manifest = JSON.parse(manifestBuffer);
  const { json: gltf, bin } = parseGlb(glb);

  assert.equal(gltf.asset.version, '2.0');
  assert.equal(gltf.scenes.length, 1);
  assert.equal(gltf.scene, 0);
  assert.equal(gltf.scenes[0].nodes.length, 1);

  const rootIndex = gltf.scenes[0].nodes[0];
  assert.equal(gltf.nodes[rootIndex].name, 'ZetrixCube');
  const descendants = collectDescendants(gltf, rootIndex);
  assert.equal(descendants.size, gltf.nodes.length, 'all nodes must belong to the root');

  const nodeNames = new Set(gltf.nodes.map((node) => node.name));
  for (const name of [
    'Blocks_Graphite',
    'Blocks_BrushedMetal',
    'Blocks_SmokedGlass',
    'Circuit_Seams',
    'Circuit_Nodes',
    'Internal_Core',
  ]) assert(nodeNames.has(name), `missing required group: ${name}`);

  const materialNames = new Set(gltf.materials.map((material) => material.name));
  for (const name of [
    'ZTX_Graphite',
    'ZTX_BrushedMetal',
    'ZTX_SmokedGlass',
    'ZTX_CrimsonEmissive',
    'ZTX_Core',
  ]) assert(materialNames.has(name), `missing required material: ${name}`);

  assert(gltf.extensionsUsed.includes('KHR_materials_transmission'));
  assert(gltf.extensionsUsed.includes('KHR_materials_emissive_strength'));
  assert.equal(gltf.images, undefined, 'asset must not embed bitmap images');
  assert.equal(gltf.textures, undefined, 'asset must not use bitmap textures');
  assert.equal(gltf.animations, undefined, 'scroll rotation is controlled by the website');
  assert.equal(gltf.buffers.length, 1);
  assert.equal(gltf.buffers[0].uri, undefined, 'binary data must stay inside the GLB');
  assert(gltf.buffers[0].byteLength <= bin.length);

  for (const view of gltf.bufferViews) {
    assert((view.byteOffset ?? 0) + view.byteLength <= bin.length, 'bufferView exceeds BIN chunk');
  }

  assert(gltf.nodes.length >= 70 && gltf.nodes.length <= 180, 'node count must stay web-friendly');
  assert(glb.length < 2_000_000, 'GLB must remain below 2 MB');

  const triangleCount = gltf.meshes.reduce((sum, mesh) => sum + mesh.primitives.reduce((meshSum, primitive) => {
    const indexAccessor = gltf.accessors[primitive.indices];
    return meshSum + indexAccessor.count / 3;
  }, 0), 0);
  assert(triangleCount < 15_000, 'triangle count must remain below 15k');

  for (const component of manifest.bounds.center) assert(Math.abs(component) <= 0.05);
  for (const component of manifest.bounds.size) assert(component >= 1.8 && component <= 2.3);
  assert.equal(manifest.externalResources, false);
  assert.equal(manifest.byteSize, glb.length);
  assert.equal(manifest.sha256, createHash('sha256').update(glb).digest('hex'));
  assert.equal(manifest.nodeCount, gltf.nodes.length);
  assert.equal(manifest.triangleCount, triangleCount);
});
