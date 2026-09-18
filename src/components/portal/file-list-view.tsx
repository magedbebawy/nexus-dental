"use client";

import { useState } from "react";
import { Download, File, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { formatFileSize, formatDateTime } from "@/lib/utils";
import { getSecureDownloadUrl } from "@/lib/services/files";
import type { CaseFile } from "@/lib/types";

interface FileListViewProps {
  files: CaseFile[];
  title?: string;
  allowEmptyNotice?: boolean;
}

export function FileListView({ files }: FileListViewProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const customerFiles = files.filter((f) => f.file_category === "customer_file");
  const designerFiles = files.filter((f) => f.file_category === "designer_file");

  const handleDownload = async (file: CaseFile) => {
    setDownloadingId(file.id);
    try {
      const url = await getSecureDownloadUrl(file.storage_path);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const renderFileBlock = (
    title: string,
    fileGroup: CaseFile[],
    badgeColor: string,
    emptyMessage: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title} ({fileGroup.length})
          </h4>
        </div>
      </div>

      {fileGroup.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-[#0a1020]/40 text-center">
          <p className="text-xs text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {fileGroup.map((file) => {
            const isDownloading = downloadingId === file.id;
            const is3D = [".stl", ".obj", ".ply"].some((ext) =>
              file.file_name.toLowerCase().endsWith(ext)
            );

            return (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-[#0c1425]/60 hover:border-slate-700/80 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white text-xs sm:text-sm truncate">
                        {file.file_name}
                      </p>
                      {is3D && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40 shrink-0">
                          3D CAD
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDateTime(file.created_at)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(file)}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-cyan-500 hover:text-slate-950 transition-all duration-150 shrink-0 cursor-pointer disabled:opacity-50"
                  title="Download File"
                >
                  {isDownloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isDownloading ? "Preparing..." : "Download"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Customer Files Section */}
      {renderFileBlock(
        "Customer Files",
        customerFiles,
        "bg-sky-400",
        "No patient scan or prescription files were uploaded."
      )}

      {/* Designer Files Section */}
      {renderFileBlock(
        "Completed Design Files",
        designerFiles,
        "bg-emerald-400",
        "No finished CAD design files uploaded yet. Case is in progress."
      )}
    </div>
  );
}
