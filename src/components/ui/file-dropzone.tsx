"use client";

import * as React from "react";
import { useId, useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_BYTES } from "@/lib/constants/dental";

export interface SelectedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  extension: string;
  isDental3D: boolean;
}

interface FileDropzoneProps {
  onFilesSelected: (files: SelectedFile[]) => void;
  selectedFiles: SelectedFile[];
  maxFiles?: number;
  label?: string;
  category?: "customer_file" | "designer_file";
  className?: string;
}

export function FileDropzone({
  onFilesSelected,
  selectedFiles,
  maxFiles = 10,
  label = "Upload Case Files (3D Scans, CBCT, Prescription)",
  className,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setErrorMessage(null);

    const validNewFiles: SelectedFile[] = [];
    const filesArray = Array.from(incomingFiles);

    for (const file of filesArray) {
      const ext = "." + (file.name.split(".").pop() || "").toLowerCase();

      if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
        setErrorMessage(
          `Unsupported file format "${ext}". Supported: ${ALLOWED_FILE_EXTENSIONS.join(", ")}`
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`File "${file.name}" exceeds the maximum 100MB limit.`);
        continue;
      }

      const isDental3D = [".stl", ".obj", ".ply"].includes(ext);
      validNewFiles.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        extension: ext,
        isDental3D,
      });
    }

    if (validNewFiles.length > 0) {
      const updated = [...selectedFiles, ...validNewFiles].slice(0, maxFiles);
      onFilesSelected(updated);
    }
  };

  const removeFile = (id: string) => {
    const filtered = selectedFiles.filter((f) => f.id !== id);
    onFilesSelected(filtered);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold tracking-wide uppercase text-slate-300"
        >
          {label}
        </label>
        <span className="text-xs text-slate-400">
          {selectedFiles.length}/{maxFiles} files
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center",
          "bg-[#0c1425]/50 hover:bg-[#0f1b33]/60",
          isDragOver
            ? "border-cyan-400 bg-cyan-950/20 scale-[0.99]"
            : "border-slate-700/80 hover:border-slate-600"
        )}
      >
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={ALLOWED_FILE_EXTENSIONS.join(",")}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 text-cyan-400 shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-medium text-white mb-1">
          <span className="text-cyan-400 hover:underline">Click to browse</span> or drag and drop scanner files
        </p>

        <p className="text-xs text-slate-400 max-w-sm mb-3">
          Dental 3D Models (STL, OBJ, PLY), CBCT DICOM Archives (ZIP), Rx (PDF, Images) up to 100MB
        </p>

        {/* Formats Tags */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {ALLOWED_FILE_EXTENSIONS.map((ext) => (
            <span
              key={ext}
              className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700"
            >
              {ext.replace(".", "")}
            </span>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files Preview List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-medium text-slate-400">Selected Files Ready for Upload:</p>
          <div className="grid gap-2">
            {selectedFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-sm hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400">
                    <FileIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-xs truncate max-w-xs sm:max-w-md">
                      {f.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatFileSize(f.size)}</span>
                      {f.isDental3D && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 text-[10px] border border-cyan-800/40">
                          3D Scan
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
