import React, { useState } from "react";
import styles from "./VideoUploader.module.css";

export default function VideoUploader() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bitrate, setBitrate] = useState("");
  const [outputDetails, setOutputDetails] = useState({
    duration: "00:00:00",
    size: "0 MB",
  });

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStartTime(e.target.value);
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndTime(e.target.value);
  const handleBitrateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBitrate(e.target.value);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setVideoFile(file);
      // Can also handle the file upload process here
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setVideoFile(file);
      // Handle the file upload process here
    }
  };

  // Converts the file size to MB and rounds to two decimal places
  const fileSizeInMB = (fileSize: number) =>
    (fileSize / (1024 * 1024)).toFixed(2);

  // Placeholder function for processing video
  const processVideo = () => {
    // This function would actually call a backend API to process the video
    // After processing, the backend would return the output video details
    // For e.g
    setOutputDetails({ duration: "01:30:00", size: "800 MB" });
  };

  // Placeholder function for downloading video
  const downloadVideo = () => {
    // This function would provide the processed video file to the user for download
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
            accept="video/*"
            onChange={handleFileUpload}
            className={styles.fileInput}
          />
          {videoFile ? (
            <div className={styles.fileDetails}>
              <span>
                {videoFile.name} - {fileSizeInMB(videoFile.size)} MB
              </span>
              <br />
              <button className="mt-4" onClick={() => setVideoFile(null)}>
                Replace File
              </button>
            </div>
          ) : (
            <p>
              Drag and drop a video file, or click to select one from your local
              machine.
            </p>
          )}
        </div>
        <div>
          <textarea
            readOnly
            className={styles.proofField}
            placeholder="Computational proof of the video will be displayed here after upload."
          />
        </div>
      </div>
      <div className={styles.editingControls}>
        <div className={styles.cropControl}>
          <label>
            Start Time:
            <input
              type="text"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </label>
          <label>
            End Time:
            <input type="text" value={endTime} onChange={handleEndTimeChange} />
          </label>
        </div>
        <div className={styles.compressControl}>
          <label>
            Bitrate:
            <input type="text" value={bitrate} onChange={handleBitrateChange} />
          </label>
        </div>
        <button onClick={processVideo}>Process Video</button>
        <div className={styles.outputDetails}>
          <span>Duration: {outputDetails.duration}</span>
          <span>Size: {outputDetails.size}</span>
        </div>
        <button className={styles.downloadButton} onClick={downloadVideo}>
          Download
        </button>
      </div>
    </div>
  );
}
