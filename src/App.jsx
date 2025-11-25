import React, { useState, useRef, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import WaveformChart from './components/WaveformChart';
import AnalysisControls from './components/AnalysisControls';
import SpectrumChart from './components/SpectrumChart';
import AnalysisResults from './components/AnalysisResults';
import { analyzeAudioSegment } from './utils/audioProcessing';

const AudioSpectrumAnalyzer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [sampleRate, setSampleRate] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [segmentDuration, setSegmentDuration] = useState(20);
  const [windowFunction, setWindowFunction] = useState("hanning");
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformData, setWaveformData] = useState([]);
  const [segmentWaveform, setSegmentWaveform] = useState([]);
  const [spectrumData, setSpectrumData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);

  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setAudioFile(file);

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContextRef.current.decodeAudioData(
      arrayBuffer
    );

    const channelData = audioBuffer.getChannelData(0);
    setSampleRate(audioBuffer.sampleRate);
    setDuration(audioBuffer.duration);
    setAudioData(channelData);

    const step = Math.floor(channelData.length / 1000);
    const waveform = [];
    for (let i = 0; i < channelData.length; i += step) {
      waveform.push({
        time: ((i / audioBuffer.sampleRate) * 1000).toFixed(1),
        amplitude: channelData[i],
      });
    }
    setWaveformData(waveform);

    setStartTime(0);
    setSegmentDuration(Math.min(20, audioBuffer.duration * 1000));
  };

  const handleAnalyze = () => {
    if (!audioData) return;

    const result = analyzeAudioSegment(
      audioData,
      startTime,
      segmentDuration,
      sampleRate,
      windowFunction
    );
    setSegmentWaveform(result.segmentWaveform);
    setSpectrumData(result.spectrumData);
    setAnalysisResults(result.analysisResults);
  };

  const handlePlayAudio = async () => {
    if (!audioFile || !audioContextRef.current) return;

    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = await audioContextRef.current.decodeAudioData(
      arrayBuffer
    );

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    const startSample = Math.floor((startTime / 1000) * sampleRate);
    const offsetTime = startSample / sampleRate;
    const playDuration = segmentDuration / 1000;

    source.start(0, offsetTime, playDuration);
    sourceRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
      setIsPlaying(false);
      sourceRef.current = null;
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Audio Signal Spectrum Analyzer
          </h1>
          <p className="text-slate-300">Short-time spectrum analysis</p>
        </div>

        <FileUpload audioFile={audioFile} onFileUpload={handleFileUpload} />

        {audioData && (
          <>
            <WaveformChart
              data={waveformData}
              title="Full signal"
              color="#3b82f6"
              duration={duration}
              sampleRate={sampleRate}
            />

            <AnalysisControls
              startTime={startTime}
              setStartTime={setStartTime}
              segmentDuration={segmentDuration}
              setSegmentDuration={setSegmentDuration}
              windowFunction={windowFunction}
              setWindowFunction={setWindowFunction}
              duration={duration}
              onAnalyze={handleAnalyze}
              onPlay={handlePlayAudio}
              isPlaying={isPlaying}
            />

            {segmentWaveform.length > 0 && (
              <WaveformChart
                data={segmentWaveform}
                title="Segment Time"
                color="#10b981"
              />
            )}

            {spectrumData.length > 0 && <SpectrumChart data={spectrumData} />}

            {analysisResults && <AnalysisResults results={analysisResults} />}
          </>
        )}
      </div>
    </div>
  );
};

export default AudioSpectrumAnalyzer;
