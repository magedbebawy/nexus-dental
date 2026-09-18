export const DENTAL_SERVICES = [
  {
    id: "crown-and-bridge",
    name: "Crown & Bridge",
    turnaround: "24-48 hours",
    description: "High-precision monolithic zirconia, e.max, and multi-unit bridge CAD designs.",
  },
  {
    id: "implant",
    name: "Implant",
    turnaround: "48 hours",
    description: "Custom titanium abutments, screw-retained crowns, and implant bridge frameworks.",
  },
  {
    id: "denture",
    name: "Denture",
    turnaround: "48-72 hours",
    description: "Digital full arches, try-ins, and printed or milled denture base designs.",
  },
  {
    id: "partial",
    name: "Partial",
    turnaround: "48-72 hours",
    description: "Laser-sintered or castable partial framework designs with optimized retentive clasping.",
  },
  {
    id: "night-guard",
    name: "Night Guard",
    turnaround: "24 hours",
    description: "Hard/soft splints, flat-plane splints, and anterior deprogrammers calibrated to patient occlusal scans.",
  },
  {
    id: "surgical-guide",
    name: "Surgical Guide",
    turnaround: "48 hours",
    description: "CBCT-fused surgical guides with precise sleeve offsets and bone/tooth supported stability.",
  },
  {
    id: "smile-design",
    name: "Smile Design",
    turnaround: "24-48 hours",
    description: "2D to 3D diagnostic wax-ups and esthetic pre-visualization cases.",
  },
  {
    id: "full-arch",
    name: "Full Arch",
    turnaround: "3-4 days",
    description: "All-on-X full-arch provisional and definitive titanium-zirconia restorative designs.",
  },
] as const;

export type DentalServiceName = (typeof DENTAL_SERVICES)[number]["name"];

export const CASE_STATUS_CONFIG = {
  uploaded: {
    label: "Uploaded",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
    description: "Case submitted and pending designer assignment",
  },
  assigned: {
    label: "Assigned",
    color: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    dot: "bg-sky-400",
    description: "CAD designer assigned and currently designing",
  },
  done: {
    label: "Done",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
    description: "Design completed and ready for download",
  },
} as const;

export const ALLOWED_FILE_EXTENSIONS = [
  ".stl",
  ".obj",
  ".ply",
  ".zip",
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
];

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
