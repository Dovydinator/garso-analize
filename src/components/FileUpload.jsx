import { Upload } from "lucide-react";

const FileUpload = ({ audioFile, onFileUpload }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 mb-3 text-slate-400" />
          <p className="mb-2 text-sm text-slate-400">
            <span className="font-semibold">Click to upload</span> or drag and drop WAV file
          </p>
          {audioFile && <p className="text-xs text-blue-400">Loaded: {audioFile.name}</p>}
        </div>
        <input type="file" className="hidden" accept=".wav,audio/wav" onChange={onFileUpload} />
      </label>
    </div>
  );
};

export default FileUpload;