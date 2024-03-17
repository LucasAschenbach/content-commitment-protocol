import React, { useEffect, useRef, useState } from "react";
import styles from "./VideoUploader.module.css";
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { compileCircuitCompress, compileCircuitCompressReturn, compileCircuitCrop, compileCircuitInit } from "@/lib/compileCircuits";
import opsDB from '@/circuits/ops_db.json';
const WaveFile = require("wavefile").WaveFile;

type ProofDataScheme = {
  commitment: string;
  proof: string;
  ops: { descriptor: string; args: number[] }[];
};

export default function VideoUploader() {
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [bitrate, setBitrate] = useState(96);
  const [didCompress, setDidCompress] = useState(false);
  const [outputDetails, setOutputDetails] = useState({
    duration: "00:00:00",
    size: "0 MB",
  });
  const [proofData, setproofData] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pcmData, setPcmData] = useState<ArrayBuffer | null>(null);
  const [processingState, setProcessingState] = useState<
    "idle" | "processing" | "proving"
  >("idle");

  const handleStartTimeChange = (e: any) => setStartTime(e.target.value);
  const handleEndTimeChange = (e: any) => setEndTime(e.target.value);
  // Bitrate buttons click handler
  const handleBitrateButtonClick = (newBitrate: number) => {
    setBitrate(newBitrate);
  };

  useEffect(() => {
    // This effect runs whenever pcmData changes.
    if (pcmData) {
      console.log("PCM Data is set:", pcmData);
      // Perform further actions with pcmData here
      const pcmDataArray = new Int16Array(pcmData);
      drawWaveform(pcmDataArray);
    }
  }, [pcmData]);

  const handleFileChange = async (file: File) => {
    setUploading(true);
    setAudioFile(file);
    console.log(file);
    const reader = new FileReader();

    reader.onload = async (e) => {
      console.log("ArrayBuffer Size:", e.target!.result); // Ensuring the file is read
      try {
        const wav = new WaveFile();
        wav.fromBuffer(new Uint8Array(e.target!.result as ArrayBuffer));
        console.log("WAV File Loaded:", wav.container, wav.chunkSize); // Checking WAV properties
        // Accessing the sample size (bit depth) of the WAV file
        var sampleRate = wav.fmt.sampleRate;
        sampleRate = sampleRate / 1000; // To have it in KHz
        console.log("Sample Rate:", sampleRate, "KHz");
        setBitrate(sampleRate);
        const pcm = wav.getSamples(false, Int16Array);
        console.log("PCM Data Length:", pcm.length); // Verifying PCM data length
        setPcmData(pcm);
      } catch (error) {
        console.error("Error processing WAV file:", error);
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = (event) => {
      console.error("FileReader error:", event.target!.error);
    };

    // Initiating the file reading process
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileChange(files[0]);
    }
  };

  const handleDragOver = async (e: React.DragEvent<HTMLDivElement>) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileChange(files[0]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileChange(e.target.files[0]);
    }
  };

  // Converts the file size to MB and rounds to two decimal places
  const fileSizeInMB = (fileSize: number) =>
    (fileSize / (1024 * 1024)).toFixed(2);

  // Placeholder function for processing audio
  const generateInitialProof = async () => {
    const audioPCM = new Int16Array(pcmData!);

    const circuitInitReturn = await compileCircuitCompressReturn(
      audioPCM.length
    );
    const backendInitReturn = new BarretenbergBackend(circuitInitReturn);
    const noirInitReturn = new Noir(circuitInitReturn, backendInitReturn);

    const res = await noirInitReturn.execute({
      sound: Array.from(audioPCM),
    });

    const com = res.returnValue as string;

    backendInitReturn.destroy();
    noirInitReturn.destroy();

    const circuitInit = await compileCircuitInit(audioPCM.length);
    const backendInit = new BarretenbergBackend(circuitInitReturn);
    const noirInit = new Noir(circuitInit, backendInit);

    const { proof: initProof, publicInputs: initPublicInputs } = await noirInit.generateProof({
      com: com,
      sound: Array.from(audioPCM),
    });

    const proofData: ProofDataScheme = {
      commitment: com,
      proof: Buffer.from(initProof).toString('hex'),
      ops: [{ descriptor: "init", args: [] }],
    };

    setproofData(JSON.stringify(proofData));
  };

  // This function would provide the processed audio file to the user for download
  const downloadAudio = async () => {
    if (!pcmData) return;
    // Transform audio signal
    setProcessingState("processing");

    const samplingRate = bitrate * 1000;
    const startIndex = startTime * samplingRate;
    const endIndex = endTime * samplingRate;

    const audioPCM = new Int16Array(pcmData!);
    let afterCropAudioPCM = audioPCM;

    if (
      startIndex < audioPCM!.length &&
      endIndex < audioPCM.length &&
      startIndex < endIndex
    ) {
      afterCropAudioPCM = audioPCM.slice(startIndex, endIndex); //remove end part
    }
    const dur = afterCropAudioPCM.length / samplingRate;
    const durStr = new Date(dur * 1000).toISOString().substring(11, 16);
    var resultAudio = afterCropAudioPCM;
    if (didCompress) {
      //check if compression will be applied
      const circuitCompressionReturn = await compileCircuitCompressReturn(
        afterCropAudioPCM.length
      );
      const backendCompressionReturn = new BarretenbergBackend(circuitCompressionReturn);
      const noirCompressionReturn = new Noir(circuitCompressionReturn, backendCompressionReturn);

      const res = await noirCompressionReturn.execute({
        sound: Array.from(afterCropAudioPCM),
      });

      console.log(res);
      // let afterSamplingAudioPCM = res.returnValue[0];
      // const trackLen = res.returnValue[1];

      // afterSamplingAudioPCM = afterSamplingAudioPCM.slice(0, trackLen);
      // resultAudio = new Int16Array(afterSamplingAudioPCM);

      backendCompressionReturn.destroy();
      noirCompressionReturn.destroy();
    }

    setOutputDetails({ duration: durStr, size: "800 MB" });

    // Generate proof for transformation
    setProcessingState("proving");

    const proofDataJson = JSON.parse(proofData) as ProofDataScheme;
    const com = proofDataJson.commitment;
    const prevProof = Uint8Array.from(Buffer.from(proofDataJson.proof, "hex"));
    const lastOp = proofDataJson.ops[proofDataJson.ops.length - 1];

    // data for proof generation
    setDidCompress(false);
    const sound = audioPCM;
    const soundCrop = afterCropAudioPCM;
    const soundCompress = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const contentSize = sound.length;
    const contentSizeCrop = soundCrop.length;
    const contentSizeCompress = soundCompress.length;
    const lastOpArgsLength = Object.keys(
      opsDB[lastOp.descriptor as keyof typeof opsDB].args
    ).length;

    // Create circuit
    const circuitPrev = await (async () => {
      switch (lastOp.descriptor as keyof typeof opsDB) {
        case "init":
          return compileCircuitInit(contentSize);
        case "crop":
          return compileCircuitCrop(
            contentSizeCrop,
            contentSize,
            lastOpArgsLength
          );
        case "compress":
          return compileCircuitCompress(
            contentSizeCompress,
            contentSizeCrop,
            lastOpArgsLength
          );
      }
    })();
    const circuitCrop = await compileCircuitCrop(
      contentSizeCrop,
      contentSize,
      lastOpArgsLength
    );
    const circuitCompress = await compileCircuitCompress(
      contentSizeCompress,
      contentSizeCrop,
      lastOpArgsLength
    );

    const circuits = {
      prev: circuitPrev,
      crop: circuitCrop,
      compress: circuitCompress,
    };

    const backends = {
      prev: new BarretenbergBackend(circuits.prev, {
        threads: navigator.hardwareConcurrency,
      }),
      crop: new BarretenbergBackend(circuits.crop, {
        threads: navigator.hardwareConcurrency,
      }),
      compress: new BarretenbergBackend(circuits.compress, {
        threads: navigator.hardwareConcurrency,
      }),
    };

    const noirPrograms = {
      prev: new Noir(circuits.prev, backends.prev),
      crop: new Noir(circuits.crop, backends.crop),
      compress: new Noir(circuits.compress, backends.compress),
    };

    // 1. Prove crop --------------------------------

    const prevPublicInputs = [
      com,
      sound,
      ...lastOp.args.map((arg: any) => arg.toString()),
    ];

    // backends.prev.verifyProof({ proof: prevProof, publicInputs: publicInputs });
    const {
      proofAsFields: cropProofAsFields,
      vkAsFields: cropVkAsFields,
      vkHash: cropVkHash,
    } = await backends.prev.generateRecursiveProofArtifacts(
      { proof: prevProof, publicInputs: prevPublicInputs },
      lastOpArgsLength
    );
  
    const { proof: cropProof, publicInputs: cropPublicInputs } = await noirPrograms.crop.generateProof({ inputs: {
      com: com,
      sound_new: Array.from(soundCrop),
      sound_old: Array.from(sound),
      start: startIndex,
      end: endIndex,
      verification_key: cropVkAsFields,
      proof: cropProofAsFields,
      vk_hash: cropVkHash,
    }});

    // 2. Prove compress ----------------------------

    let proofDataNew: ProofDataScheme;

    if (didCompress) {
      // backends.crop.verifyProof({ proof: cropProof, publicInputs: cropPublicInputs });
      const {
        proofAsFields: compressProofAsFields,
        vkAsFields: compressVkAsFields,
        vkHash: compressVkHash,
      } = await backends.prev.generateRecursiveProofArtifacts(
        { proof: cropProof, publicInputs: cropPublicInputs },
        2 // crop has 2 op args
      );
    
      const { proof: compressProof, publicInputs: compressPublicInputs } = await noirPrograms.crop.generateProof({ inputs: {
        com: com,
        sound_new: Array.from(soundCompress),
        sound_old: Array.from(soundCrop),
        verification_key: compressVkAsFields,
        proof: cropProofAsFields,
        vk_hash: cropVkHash,
      }});

      // Create new proof data object
      proofDataNew = {
        commitment: com,
        proof: Buffer.from(compressProof).toString("hex"),
        ops: [
          ...proofDataJson.ops,
          { descriptor: "crop", args: [startIndex, endIndex] },
          { descriptor: "compress", args: [] },
        ],
      };
    } else {
      // Create new proof data object
      proofDataNew = {
        commitment: com,
        proof: Buffer.from(cropProof).toString("hex"),
        ops: [
          ...proofDataJson.ops,
          { descriptor: "crop", args: [startIndex, endIndex] },
        ],
      };
    }

    console.log(proofDataNew);

    setProcessingState("idle");
  };

  const drawWaveform = (pcmDataArray: Int16Array) => {
    const canvas = waveformRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Assuming a large number of samples, we may need to skip samples to fit them into our canvas width
        const step = Math.ceil(pcmDataArray.length / width);
        for (let i = 0; i < pcmDataArray.length; i += step) {
          const value = pcmDataArray[i];
          // Assuming 16-bit PCM data
          const normalized = (value + 32768) / 65536; // Normalize the 16-bit data to a 0-1 range
          const y = (1 - normalized) * height;
          ctx.lineTo(i / step, y);
        }

        ctx.strokeStyle = "orange";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div
          className={styles.videoUploader}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="audio/wav"
            onChange={handleFileUpload}
            className={styles.fileInput}
          />
          {audioFile ? (
            <div className={styles.fileDetails}>
              <div className={styles.waveformContainer}>
                <canvas ref={waveformRef} width="800" height="100"></canvas>
              </div>
              <span className="m-5">
                {audioFile.name} - {fileSizeInMB(audioFile.size)} MB
              </span>
              <br />
              {/* <button onClick={() => setAudioFile(null)}>Replace File</button> */}
            </div>
          ) : (
            <p>
              Drag and drop a WAV file, or click to select one from your
              computer.
            </p>
          )}
        </div>
        <div>
          <textarea
            className={styles.proofField}
            placeholder="Computational proof of the audio will be displayed here after upload."
            value={proofData}
            onChange={(e) => setproofData(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.editingControls}>
        <div className={styles.cropControl}>
          <label>
            Start Time
            <input
              type="number"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </label>
          <label>
            End Time
            <input
              type="number"
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </label>
        </div>
        <div className={styles.bitrateCheckboxContainer}>
          {/* Render bitrate buttons */}
          <input
            type="checkbox"
            id="bitrateCheckbox"
            checked={didCompress === true}
            onChange={() => setDidCompress(!didCompress)}
          />
          <label htmlFor="bitrateCheckbox">Downsample Bitrate (in KHz)</label>
        </div>
        <div className={styles.outputContainer}>
          <div className={styles.outputDetails}>
            <span>Duration: {outputDetails.duration}</span>
            <span>Size: {outputDetails.size}</span>
          </div>
          <button className={styles.downloadButton} onClick={downloadAudio}>
            {processingState === "idle"
              ? "Download Processed Audio"
              : processingState === "processing"
              ? "Processing Audio..."
              : "Generating Proof..."}
          </button>
        </div>
      </div>
    </div>
  );
}
