import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outputDir = path.join(projectRoot, 'assets/3d');
const glbPath = path.join(outputDir, 'zetrix-blockchain-cube-v1.glb');
const manifestPath = path.join(outputDir, 'zetrix-blockchain-cube-v1-manifest.json');

const gltf = {
  asset: { version: '2.0', generator: 'Zetrix procedural GLB generator v1' },
  extensionsUsed: ['KHR_materials_transmission', 'KHR_materials_emissive_strength'],
  scene: 0,
  scenes: [{ name: 'Zetrix Blockchain Cube', nodes: [0] }],
  nodes: [],
  meshes: [],
  materials: [],
  accessors: [],
  bufferViews: [],
  buffers: [],
};

const binaryParts = [];
let binaryLength = 0;
const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };

function align4(value) { return (value + 3) & ~3; }

function addBinary(buffer, target) {
  const byteOffset = align4(binaryLength);
  if (byteOffset > binaryLength) binaryParts.push(Buffer.alloc(byteOffset - binaryLength));
  binaryParts.push(buffer);
  binaryLength = byteOffset + buffer.length;
  const index = gltf.bufferViews.length;
  gltf.bufferViews.push({ buffer: 0, byteOffset, byteLength: buffer.length, target });
  return index;
}

function addAccessor(values, componentType, type, target, includeBounds = false) {
  const componentCount = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[type];
  const typed = componentType === 5126 ? new Float32Array(values) : new Uint16Array(values);
  const buffer = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
  const accessor = {
    bufferView: addBinary(buffer, target),
    componentType,
    count: values.length / componentCount,
    type,
  };
  if (includeBounds) {
    accessor.min = Array(componentCount).fill(Infinity);
    accessor.max = Array(componentCount).fill(-Infinity);
    for (let i = 0; i < values.length; i += componentCount) {
      for (let c = 0; c < componentCount; c++) {
        accessor.min[c] = Math.min(accessor.min[c], values[i + c]);
        accessor.max[c] = Math.max(accessor.max[c], values[i + c]);
      }
    }
  }
  const index = gltf.accessors.length;
  gltf.accessors.push(accessor);
  return index;
}

function createBoxGeometry() {
  const positions = [
    -.5,-.5,.5, .5,-.5,.5, .5,.5,.5, -.5,.5,.5,
    .5,-.5,-.5, -.5,-.5,-.5, -.5,.5,-.5, .5,.5,-.5,
    .5,-.5,.5, .5,-.5,-.5, .5,.5,-.5, .5,.5,.5,
    -.5,-.5,-.5, -.5,-.5,.5, -.5,.5,.5, -.5,.5,-.5,
    -.5,.5,.5, .5,.5,.5, .5,.5,-.5, -.5,.5,-.5,
    -.5,-.5,-.5, .5,-.5,-.5, .5,-.5,.5, -.5,-.5,.5,
  ];
  const normals = [
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
    1,0,0, 1,0,0, 1,0,0, 1,0,0,
    -1,0,0, -1,0,0, -1,0,0, -1,0,0,
    0,1,0, 0,1,0, 0,1,0, 0,1,0,
    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
  ];
  const indices = [];
  for (let face = 0; face < 6; face++) {
    const i = face * 4;
    indices.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  return { positions, normals, indices };
}

function createIcosahedronGeometry() {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [
    -1,t,0, 1,t,0, -1,-t,0, 1,-t,0,
    0,-1,t, 0,1,t, 0,-1,-t, 0,1,-t,
    t,0,-1, t,0,1, -t,0,-1, -t,0,1,
  ];
  const positions = [];
  for (let i = 0; i < raw.length; i += 3) {
    const length = Math.hypot(raw[i], raw[i + 1], raw[i + 2]);
    positions.push(raw[i] / length * .5, raw[i + 1] / length * .5, raw[i + 2] / length * .5);
  }
  const indices = [
    0,11,5, 0,5,1, 0,1,7, 0,7,10, 0,10,11,
    1,5,9, 5,11,4, 11,10,2, 10,7,6, 7,1,8,
    3,9,4, 3,4,2, 3,2,6, 3,6,8, 3,8,9,
    4,9,5, 2,4,11, 6,2,10, 8,6,7, 9,8,1,
  ];
  return { positions, normals: positions.slice(), indices };
}

function addMaterial(material) {
  const index = gltf.materials.length;
  gltf.materials.push(material);
  return index;
}

const crimson = [0.7725, 0.1412, 0.1804];
const materialIndices = {
  graphite: addMaterial({
    name: 'ZTX_Graphite',
    pbrMetallicRoughness: { baseColorFactor: [0.015,0.017,0.02,1], metallicFactor: .92, roughnessFactor: .3 },
  }),
  metal: addMaterial({
    name: 'ZTX_BrushedMetal',
    pbrMetallicRoughness: { baseColorFactor: [0.065,0.07,0.075,1], metallicFactor: 1, roughnessFactor: .48 },
  }),
  glass: addMaterial({
    name: 'ZTX_SmokedGlass', alphaMode: 'BLEND', doubleSided: true,
    pbrMetallicRoughness: { baseColorFactor: [0.018,0.02,0.024,.38], metallicFactor: .05, roughnessFactor: .12 },
    extensions: { KHR_materials_transmission: { transmissionFactor: .58 } },
  }),
  crimson: addMaterial({
    name: 'ZTX_CrimsonEmissive',
    pbrMetallicRoughness: { baseColorFactor: [...crimson,1], metallicFactor: .65, roughnessFactor: .24 },
    emissiveFactor: crimson,
    extensions: { KHR_materials_emissive_strength: { emissiveStrength: 2.5 } },
  }),
  core: addMaterial({
    name: 'ZTX_Core',
    pbrMetallicRoughness: { baseColorFactor: [.12,.008,.014,1], metallicFactor: .5, roughnessFactor: .2 },
    emissiveFactor: [.35,.025,.04],
    extensions: { KHR_materials_emissive_strength: { emissiveStrength: 1.7 } },
  }),
};

const box = createBoxGeometry();
const boxAccessors = {
  position: addAccessor(box.positions, 5126, 'VEC3', 34962, true),
  normal: addAccessor(box.normals, 5126, 'VEC3', 34962),
  indices: addAccessor(box.indices, 5123, 'SCALAR', 34963),
};
const ico = createIcosahedronGeometry();
const icoAccessors = {
  position: addAccessor(ico.positions, 5126, 'VEC3', 34962, true),
  normal: addAccessor(ico.normals, 5126, 'VEC3', 34962),
  indices: addAccessor(ico.indices, 5123, 'SCALAR', 34963),
};

function addMesh(name, accessors, material) {
  const index = gltf.meshes.length;
  gltf.meshes.push({
    name,
    primitives: [{ attributes: { POSITION: accessors.position, NORMAL: accessors.normal }, indices: accessors.indices, material }],
  });
  return index;
}

const meshes = {
  graphite: addMesh('Mesh_GraphiteBlock', boxAccessors, materialIndices.graphite),
  metal: addMesh('Mesh_BrushedMetalBlock', boxAccessors, materialIndices.metal),
  glass: addMesh('Mesh_SmokedGlassBlock', boxAccessors, materialIndices.glass),
  crimsonBox: addMesh('Mesh_CrimsonSeam', boxAccessors, materialIndices.crimson),
  core: addMesh('Mesh_InternalCore', boxAccessors, materialIndices.core),
  crimsonNode: addMesh('Mesh_CrimsonNode', icoAccessors, materialIndices.crimson),
};

function addNode(name, options = {}) {
  const node = { name };
  if (options.mesh !== undefined) node.mesh = options.mesh;
  if (options.translation) node.translation = options.translation;
  if (options.scale) node.scale = options.scale;
  if (options.children) node.children = options.children;
  const index = gltf.nodes.length;
  gltf.nodes.push(node);
  if (options.translation && options.scale) {
    for (let axis = 0; axis < 3; axis++) {
      const radius = Math.abs(options.scale[axis]) / 2;
      bounds.min[axis] = Math.min(bounds.min[axis], options.translation[axis] - radius);
      bounds.max[axis] = Math.max(bounds.max[axis], options.translation[axis] + radius);
    }
  }
  return index;
}

const root = addNode('ZetrixCube', { children: [] });
const groups = {
  graphite: addNode('Blocks_Graphite', { children: [] }),
  metal: addNode('Blocks_BrushedMetal', { children: [] }),
  glass: addNode('Blocks_SmokedGlass', { children: [] }),
  seams: addNode('Circuit_Seams', { children: [] }),
  nodes: addNode('Circuit_Nodes', { children: [] }),
};
const core = addNode('Internal_Core', { mesh: meshes.core, translation: [0,0,0], scale: [1.48,1.48,1.48] });
gltf.nodes[root].children.push(...Object.values(groups), core);

const tiles = [
  [0,0,2,1], [2,0,1,2], [3,0,1,1], [0,1,1,2], [1,1,1,1],
  [3,1,1,2], [1,2,2,1], [0,3,2,1], [2,3,1,1], [3,3,1,1],
];
const faceNames = ['Front','Back','Right','Left','Top','Bottom'];
const cell = .46;
const gap = .035;

function faceTransform(face, u, v, su, sv, depth = .2, normal = .9) {
  if (face === 0) return { translation: [u,v,normal], scale: [su,sv,depth] };
  if (face === 1) return { translation: [u,v,-normal], scale: [su,sv,depth] };
  if (face === 2) return { translation: [normal,u,v], scale: [depth,su,sv] };
  if (face === 3) return { translation: [-normal,u,v], scale: [depth,su,sv] };
  if (face === 4) return { translation: [u,normal,v], scale: [su,depth,sv] };
  return { translation: [u,-normal,v], scale: [su,depth,sv] };
}

for (let face = 0; face < 6; face++) {
  for (let tile = 0; tile < tiles.length; tile++) {
    const [x,y,w,h] = tiles[(tile + face * 3) % tiles.length];
    const u = -.92 + (x + w / 2) * cell;
    const v = -.92 + (y + h / 2) * cell;
    const su = w * cell - gap;
    const sv = h * cell - gap;
    const selector = (face * 11 + tile * 7) % 10;
    const kind = selector < 2 ? 'glass' : selector < 4 ? 'metal' : 'graphite';
    const transform = faceTransform(face, u, v, su, sv);
    const node = addNode(`${faceNames[face]}_Block_${String(tile + 1).padStart(2,'0')}`, { mesh: meshes[kind], ...transform });
    gltf.nodes[groups[kind]].children.push(node);
  }
}

for (let i = 0; i < 8; i++) {
  const translation = [i & 1 ? .91 : -.91, i & 2 ? .91 : -.91, i & 4 ? .91 : -.91];
  const kind = i % 4 === 0 ? 'metal' : 'graphite';
  const node = addNode(`Corner_Block_${String(i + 1).padStart(2,'0')}`, { mesh: meshes[kind], translation, scale: [.18,.18,.18] });
  gltf.nodes[groups[kind]].children.push(node);
}

const routeOffsets = [-.48, .42];
for (let face = 0; face < 6; face++) {
  for (let route = 0; route < routeOffsets.length; route++) {
    const a = routeOffsets[route];
    const horizontal = faceTransform(face, 0, a, 1.5, .018, .018, 1.012);
    const vertical = faceTransform(face, -a * .72, 0, .018, 1.35, .018, 1.014);
    for (const [direction, transform] of [['H', horizontal], ['V', vertical]]) {
      const node = addNode(`${faceNames[face]}_Circuit_${direction}${route + 1}`, { mesh: meshes.crimsonBox, ...transform });
      gltf.nodes[groups.seams].children.push(node);
    }
  }
}

const nodePositions = [
  [0,.42,1.035], [-.48,-.48,1.035],
  [.42,0,-1.035], [-.48,.48,-1.035],
  [1.035,0,.42], [1.035,-.48,-.48],
  [-1.035,.42,0], [-1.035,-.48,.48],
  [0,1.035,.42], [-.48,1.035,-.48],
  [.42,-1.035,0], [-.48,-1.035,.48],
];
for (let i = 0; i < nodePositions.length; i++) {
  const node = addNode(`Ledger_Node_${String(i + 1).padStart(2,'0')}`, {
    mesh: meshes.crimsonNode,
    translation: nodePositions[i],
    scale: [.09,.09,.09],
  });
  gltf.nodes[groups.nodes].children.push(node);
}

const paddedBinaryLength = align4(binaryLength);
if (paddedBinaryLength > binaryLength) binaryParts.push(Buffer.alloc(paddedBinaryLength - binaryLength));
const binary = Buffer.concat(binaryParts);
gltf.buffers.push({ byteLength: binaryLength });

function buildGlb() {
  const jsonBytes = Buffer.from(JSON.stringify(gltf));
  const jsonLength = align4(jsonBytes.length);
  const jsonChunk = Buffer.alloc(jsonLength, 0x20);
  jsonBytes.copy(jsonChunk);
  const totalLength = 12 + 8 + jsonChunk.length + 8 + binary.length;
  const output = Buffer.alloc(totalLength);
  output.writeUInt32LE(0x46546c67, 0);
  output.writeUInt32LE(2, 4);
  output.writeUInt32LE(totalLength, 8);
  output.writeUInt32LE(jsonChunk.length, 12);
  output.writeUInt32LE(0x4e4f534a, 16);
  jsonChunk.copy(output, 20);
  const binHeader = 20 + jsonChunk.length;
  output.writeUInt32LE(binary.length, binHeader);
  output.writeUInt32LE(0x004e4942, binHeader + 4);
  binary.copy(output, binHeader + 8);
  return output;
}

const glb = buildGlb();
const center = bounds.min.map((min, i) => (min + bounds.max[i]) / 2);
const size = bounds.min.map((min, i) => bounds.max[i] - min);
const triangleCount = gltf.meshes.reduce((sum, mesh) => sum + mesh.primitives.reduce((meshSum, primitive) => {
  return meshSum + gltf.accessors[primitive.indices].count / 3;
}, 0), 0);
const manifest = {
  name: 'Zetrix Blockchain Cube',
  version: 1,
  file: 'zetrix-blockchain-cube-v1.glb',
  byteSize: glb.length,
  sha256: createHash('sha256').update(glb).digest('hex'),
  sceneCount: gltf.scenes.length,
  rootNode: 'ZetrixCube',
  groupNames: ['Blocks_Graphite','Blocks_BrushedMetal','Blocks_SmokedGlass','Circuit_Seams','Circuit_Nodes','Internal_Core'],
  materialNames: gltf.materials.map((material) => material.name),
  extensionsUsed: gltf.extensionsUsed,
  bounds: { min: bounds.min, max: bounds.max, center, size },
  nodeCount: gltf.nodes.length,
  meshCount: gltf.meshes.length,
  primitiveCount: gltf.meshes.reduce((sum, mesh) => sum + mesh.primitives.length, 0),
  triangleCount,
  externalResources: false,
  animation: { baked: false, intendedControl: 'website scroll rotates ZetrixCube root' },
};

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(glbPath, glb),
  writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`),
]);

console.log(JSON.stringify({ glbPath, manifestPath, ...manifest }, null, 2));
