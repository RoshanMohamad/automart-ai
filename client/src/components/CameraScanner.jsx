'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const CameraScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        setError('Error accessing camera: ' + err.message);
      }
    };

    startCamera();  
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleScan = async () => {
    if (videoRef.current && scanning) {
      const qrCodeScanner = new Html5Qrcode(videoRef.current);
      qrCodeScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText, decodedResult) => {
          setScanResult(decodedText);
          onScan(decodedText);
        },
        (errorMessage) => {
          setError('Error scanning QR code: ' + errorMessage);
        }
      );
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {error && <div>Error: {error}</div>}
      {scanning && <div>Scanning...</div>}
      {scanResult && <div>Scan Result: {scanResult}</div>}
    </div>
  );
};

export default CameraScanner;
