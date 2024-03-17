import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { CompiledCircuit } from '@noir-lang/types';

// import circuit templates and Nargo.toml files
import circuit_init_noir from '@/circuits/init/src/main.nr.template';
import circuit_init_nargo from '@/circuits/init/Nargo.toml';
import circuit_init_return_noir from '@/circuits/init_return/src/main.nr.template';
import circuit_init_return_nargo from '@/circuits/init_return/Nargo.toml';
import circuit_crop_noir from '@/circuits/crop/src/main.nr.template';
import circuit_crop_nargo from '@/circuits/crop/Nargo.toml';
import circuit_compress_noir from '@/circuits/compress/src/main.nr.template';
import circuit_compress_nargo from '@/circuits/compress/Nargo.toml';
import circuit_compress_return_noir from '@/circuits/compress_return/src/main.nr.template';
import circuit_compress_return_nargo from '@/circuits/compress_return/Nargo.toml';

const circuitTemplates: {[key: string]: { noir: string, nargo: string }} = {
  "init": {
    noir: circuit_init_noir,
    nargo: circuit_init_nargo,
  },
  "init_return": {
    noir: circuit_init_return_noir,
    nargo: circuit_init_return_nargo,
  },
  "crop": {
    noir: circuit_crop_noir,
    nargo: circuit_crop_nargo,
  },
  "compress": {
    noir: circuit_compress_noir,
    nargo: circuit_compress_nargo,
  },
  "compress_return": {
    noir: circuit_compress_return_noir,
    nargo: circuit_compress_return_nargo,
  },
};

export async function compileCircuitInit(contentSize: number): Promise<CompiledCircuit> {
  return await compileCircuit('init', {
    content_size: contentSize.toString(),
  });
}

export async function compileCircuitInitReturn(contentSize: number): Promise<CompiledCircuit> {
  return await compileCircuit('init_return', {
    content_size: contentSize.toString(),
  });
}

export async function compileCircuitCrop(contentSize: number, oldContentSize: number, lastOpArgs: number): Promise<CompiledCircuit> {
  return await compileCircuit('crop', {
    content_size: contentSize.toString(),
    old_content_size: oldContentSize.toString(),
    last_op_args: lastOpArgs.toString()
  });
}

export async function compileCircuitCompress(contentSize: number, oldContentSize: number, lastOpArgs: number): Promise<CompiledCircuit> {
  return await compileCircuit('compress', {
    content_size: contentSize.toString(),
    old_content_size: oldContentSize.toString(),
    last_op_args: lastOpArgs.toString()
  });
}

export async function compileCircuitCompressReturn(contentSize: number): Promise<CompiledCircuit> {
  return await compileCircuit('compress_return', {
    content_size: contentSize.toString(),
  });
}

async function compileCircuit(circuitName: string, args: { [key: string]: string } = {}): Promise<CompiledCircuit> {
  const fm = createFileManager('/');
  const main = new Blob([circuitTemplates[circuitName].noir]).stream();
  const nargo = new Blob([circuitTemplates[circuitName].nargo]).stream();

  fm.writeFile('./src/main.nr', main);
  fm.writeFile('./Nargo.toml', nargo);
  const result = await compile(fm);
  if (!('program' in result)) {
    throw new Error('Compilation failed');
  }
  return result.program as CompiledCircuit;
}
