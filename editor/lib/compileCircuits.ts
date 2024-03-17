import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { CompiledCircuit } from '@noir-lang/types';

export async function compileCircuitInit(contentSize: number): Promise<CompiledCircuit> {
  return await compileCircuit('../circuits/init/', {
    content_size: contentSize.toString(),
  });
}

export async function compileCircuitInitReturn(contentSize: number): Promise<CompiledCircuit> {
  return await compileCircuit('../circuits/init_return/', {
    content_size: contentSize.toString(),
  });
}

export async function compileCircuitCrop(contentSize: number, oldContentSize: number, lastOpArgs: number): Promise<CompiledCircuit> {
  return await compileCircuit('../circuits/crop/', {
    content_size: contentSize.toString(),
    old_content_size: oldContentSize.toString(),
    last_op_args: lastOpArgs.toString()
  });
}

export async function compileCircuitCompress(contentSize: number, oldContentSize: number, lastOpArgs: number): Promise<CompiledCircuit> {
  return await compileCircuit('../circuits/compress/', {
    content_size: contentSize.toString(),
    old_content_size: oldContentSize.toString(),
    last_op_args: lastOpArgs.toString()
  });
}

export async function compileCircuitCompressReturn(contentSize: number): Promise<CompiledCircuit> {
  return await compileCircuit('../circuits/compress_return/', {
    content_size: contentSize.toString(),
  });
}

async function compileCircuit(circuitPath: string, args: { [key: string]: string } = {}): Promise<CompiledCircuit> {
  const fm = createFileManager('/');
  const main = (await fetch(new URL(`../circuits/crop/src/main.nr`, import.meta.url)))
    .body as ReadableStream<Uint8Array>;
  const nargoToml = (await fetch(new URL(`../circuits/crop/Nargo.toml`, import.meta.url)))
    .body as ReadableStream<Uint8Array>;

  fm.writeFile('./src/main.nr', main);
  fm.writeFile('./Nargo.toml', nargoToml);
  const result = await compile(fm);
  if (!('program' in result)) {
    throw new Error('Compilation failed');
  }
  return result.program as CompiledCircuit;
}
