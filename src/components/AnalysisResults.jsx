const AnalysisResults = ({ results }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-blue-400 mb-3">Parameters</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-400">Segment Length:</span> <span className="font-medium">{results.segmentLength} samples</span></p>
            <p><span className="text-slate-400">Duration:</span> <span className="font-medium">{results.segmentDurationMs} ms</span></p>
            <p><span className="text-slate-400">Sample Rate:</span> <span className="font-medium">{results.sampleRate} Hz</span></p>
            <p><span className="text-slate-400">Window Function:</span> <span className="font-medium capitalize">{results.windowType}</span></p>
            <p><span className="text-slate-400">Max Frequency:</span> <span className="font-medium">{results.maxObservedFrequency.toFixed(2)} Hz</span></p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-green-400 mb-3">Dominant Frequencies</h3>
          <div className="space-y-2 text-sm">
            {results.dominantPeaks.map((peak, i) => (
              <p key={i}>
                <span className="text-slate-400">{i + 1}. </span>
                <span className="font-medium">{peak.frequency.toFixed(2)} Hz</span>
                <span className="text-slate-500"> (amplitude: {peak.magnitude.toFixed(3)})</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;