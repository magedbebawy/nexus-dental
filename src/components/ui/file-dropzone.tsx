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
          className="block text-xs font-bold tracking-wide uppercase text-slate-700"
        >
          {label}
        </label>
        <span className="text-xs text-slate-500 font-medium">
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
          "relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center shadow-xs",
          "bg-[#F8FAF9] hover:bg-[#F0FAF5]",
          isDragOver
            ? "border-[#00C48C] bg-[#E8F8F2] scale-[0.99]"
            : "border-slate-300 hover:border-[#00C48C]"
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

        <div className="w-12 h-12 rounded-full bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center mb-3 text-[#008F66] shadow-xs">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-bold text-slate-900 mb-1">
          <span className="text-[#008F66] hover:underline">Click to browse</span> or drag and drop scanner files
        </p>

        <p className="text-xs text-slate-500 max-w-sm mb-3">
          Dental 3D Models (STL, OBJ, PLY), CBCT DICOM Archives (ZIP), Rx (PDF, Images) up to 100MB
        </p>

        {/* Formats Tags */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {ALLOWED_FILE_EXTENSIONS.map((ext) => (
            <span
              key={ext}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white text-slate-700 border border-slate-200 shadow-xs"
            >
              {ext.replace(".", "")}
            </span>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files Preview List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-slate-700">Selected Files Ready for Upload:</p>
          <div className="grid gap-2">
            {selectedFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-sm hover:border-[#00C48C] transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-[#E8F8F2] text-[#008F66]">
                    <FileIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate max-w-xs sm:max-w-md">
                      {f.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{formatFileSize(f.size)}</span>
                      {f.isDental3D && (
                        <span className="px-1.5 py-0.2 rounded bg-[#E8F8F2] text-[#008F66] text-[10px] font-bold border border-[#B6EAD5]">
                          3D Scan
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C48C]" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
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
