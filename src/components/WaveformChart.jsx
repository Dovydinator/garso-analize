import React from "react"; 
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Zap } from "lucide-react";


const WaveformChart = ({ data, title, color = "#3b82f6", duration, sampleRate }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-blue-400" />
        {title}
      </h2>
      {duration !== undefined && sampleRate !== undefined && (
        <p className="text-sm text-slate-400 mb-4">
          Duration: {duration.toFixed(2)}s | Sample Rate: {sampleRate} Hz
        </p>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
          <YAxis stroke="#94a3b8" label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          <Line type="monotone" dataKey="amplitude" stroke={color} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaveformChart;