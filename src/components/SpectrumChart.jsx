import React from "react"; 
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";


const SpectrumChart = ({ data }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4">Amplitude Spectrum</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="frequency" stroke="#94a3b8" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
          <YAxis stroke="#94a3b8" label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          <Line type="monotone" dataKey="magnitude" stroke="#f59e0b" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpectrumChart;