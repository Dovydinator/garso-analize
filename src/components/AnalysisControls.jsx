import { Play, Pause } from "lucide-react";

const AnalysisControls = ({ 
  startTime, 
  setStartTime, 
  segmentDuration, 
  setSegmentDuration, 
  windowFunction, 
  setWindowFunction,
  duration,
  onAnalyze,
  onPlay,
  isPlaying
}) => {
  const handleStartTimeChange = (e) => {
    const value = Math.max(0, Math.min(parseFloat(e.target.value) || 0, (duration * 1000) - segmentDuration));
    setStartTime(value);
  };

  const handleSegmentDurationChange = (e) => {
    const value = Math.max(1, Math.min(parseFloat(e.target.value) || 20, 1000));
    setSegmentDuration(value);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4">Analysis Parameters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Start Time (ms)
          </label>
          <input
            type="number"
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            step="1"
            min="0"
            max={(duration * 1000) - segmentDuration}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Segment Duration (ms)
          </label>
          <input
            type="number"
            value={segmentDuration}
            onChange={handleSegmentDurationChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            step="1"
            min="1"
            max="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Window Function
          </label>
          <select
            value={windowFunction}
            onChange={(e) => setWindowFunction(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="hanning">Hanning</option>
            <option value="hamming">Hamming</option>
            <option value="triangle">Triangle</option>
            <option value="rectangular">Rectangular</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={onAnalyze}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-blue-500/50"
        >
          Analyze Segment
        </button>
        <button
          onClick={onPlay}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Stop' : 'Play Segment'}
        </button>
      </div>
    </div>
  );
};

export default AnalysisControls;