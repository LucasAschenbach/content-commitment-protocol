import React, { useEffect, useRef, useState } from "react";
import styles from "./VideoUploader.module.css";
const WaveFile = require("wavefile").WaveFile;

export default function VideoUploader() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bitrate, setBitrate] = useState(96);
  const [outputDetails, setOutputDetails] = useState({
    duration: "00:00:00",
    size: "0 MB",
  });
  const [proof, setProof] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pcmData, setPcmData] = useState<ArrayBuffer | null>(null);
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "proving">("idle");

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStartTime(e.target.value);
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndTime(e.target.value);
  // Bitrate buttons click handler
  const handleBitrateButtonClick = (newBitrate: number) => {
    setBitrate(newBitrate);
  };

  useEffect(() => {
    // This effect runs whenever pcmData changes.
    if (pcmData) {
      console.log("PCM Data is set:", pcmData);
      // Perform further actions with pcmData here
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
  const processAudio = () => {
  };

  // This function would provide the processed audio file to the user for download
  const downloadAudio = async () => {
    // Transform audio signal
    setProcessingState("processing");


    setOutputDetails({ duration: "01:30:00", size: "800 MB" });

    // Generate proof for transformation
    setProcessingState("proving");


    // Bundle the proof and processed audio file for download


    setProcessingState("idle");
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
              <span>
                {audioFile.name} - {fileSizeInMB(audioFile.size)} MB
              </span>
              <br />
              <button onClick={() => setAudioFile(null)}>Replace File</button>
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
            readOnly
            className={styles.proofField}
            placeholder="Computational proof of the video will be displayed here after upload."
            value={proof}
          />
        </div>
      </div>
      <div className={styles.editingControls}>
        <div className={styles.cropControl}>
          <label>
            Start Time
            <input
              type="text"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </label>
          <label>
            End Time
            <input type="text" value={endTime} onChange={handleEndTimeChange} />
          </label>
        </div>
        <div className={styles.compressControl}>
          <label>Bitrate (in KHz)</label>
          <div className={styles.bitrateButtonContainer}>
            {/* Render bitrate buttons */}
            <button
              className={`${styles.bitrateButton} ${
                bitrate === 96 ? styles.active : ""
              }`}
              onClick={() => handleBitrateButtonClick(96)}
            >
              96
            </button>
            <button
              className={`${styles.bitrateButton} ${
                bitrate === 48 ? styles.active : ""
              }`}
              onClick={() => handleBitrateButtonClick(48)}
            >
              48
            </button>
            <button
              className={`${styles.bitrateButton} ${
                bitrate === 24 ? styles.active : ""
              }`}
              onClick={() => handleBitrateButtonClick(24)}
            >
              24
            </button>
          </div>
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
