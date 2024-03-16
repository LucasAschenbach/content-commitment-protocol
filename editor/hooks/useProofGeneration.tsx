import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { compileCircuitInit, compileCircuitCrop, compileCircuitCompress } from '../lib/compileCircuits';
import { BarretenbergBackend, ProofData } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import opsDB from '../circuits/ops_db.json';

type SoundObject = {
  sound: number[];
  bitrate: number;
  start: number;
}

type Transformation = {
  soundNew: SoundObject;
  soundOld: SoundObject;
  lastOp: "init" | "crop" | "compress";
}

export function useSoundProofGeneration(transform: Transformation, inputs?: { [key: string]: string }) {
  const [proofData, setProofData] = useState<ProofData | undefined>();
  const [noir, setNoir] = useState<Noir | undefined>();

  const proofGeneration = async () => {
    if (!inputs) return;

    const lastOp = opsDB[transform.lastOp];
    const lastOpArgNum = Object.keys(lastOp.args).length;

    const contentSize = transform.soundNew.sound.length;
    const contentSizeOld = transform.soundOld.sound.length;

    const contentDuration = transform.soundNew.sound.length / transform.soundNew.bitrate;
    const contentOldDuration = transform.soundOld.sound.length / transform.soundOld.bitrate;

    // check which ops were performed
    let crop = contentDuration !== contentOldDuration;
    let compress = transform.soundNew.bitrate !== transform.soundOld.bitrate;

    const circuitInit = await compileCircuitInit(contentSize);
    const circuitCrop = await compileCircuitCrop(contentSize, contentSizeOld, lastOpArgNum);
    const circuitCompress = await compileCircuitCompress(contentSize, contentSizeOld, lastOpArgNum);

    const backend = new BarretenbergBackend(circuit, { threads: navigator.hardwareConcurrency });
    const noir = new Noir(circuit, backend);

    await toast.promise(noir.init, {
      pending: 'Initializing Noir...',
      success: 'Noir initialized!',
      error: 'Error initializing Noir',
    });

    const data = await toast.promise(noir.generateProof(inputs), {
      pending: 'Generating proof',
      success: 'Proof generated',
      error: 'Error generating proof',
    });

    setProofData(data);
    setNoir(noir);
  };

  useEffect(() => {
    if (!inputs) return;
    proofGeneration();
  }, [inputs]);

  return { noir, proofData };
}
