export const DENTAL_SERVICES = [
  {
    id: "crown-and-bridge",
    name: "Crown & Bridge",
    unitPrice: 6,
    turnaround: "24 hours",
    description: "High-precision monolithic zirconia, e.max, and bridge designs (includes model).",
    includesModel: true,
  },
  {
    id: "model-only",
    name: "Model Only",
    unitPrice: 6,
    turnaround: "24 hours",
    description: "Digital hollow/solid dental model design with ditching and articulate bases.",
    includesModel: true,
  },
  {
    id: "diagnostic-wax-up",
    name: "Diagnostic Wax-Up",
    unitPrice: 11,
    turnaround: "24-48 hours",
    description: "2D to 3D diagnostic wax-up and aesthetic pre-visualization smile design.",
    includesModel: false,
  },
  {
    id: "night-guard",
    name: "Night Guard",
    unitPrice: 15,
    turnaround: "24 hours",
    description: "Hard/soft splints, flat-plane splints, and occlusal deprogrammers.",
    includesModel: false,
  },
  {
    id: "screw-retained",
    name: "Screw Retained",
    unitPrice: 18,
    turnaround: "48 hours",
    description: "Screw-retained crown and implant bridge restorations (includes model).",
    includesModel: true,
  },
  {
    id: "custom-abutment",
    name: "Custom Abutment",
    unitPrice: 21,
    turnaround: "48 hours",
    description: "Custom titanium and hybrid zirconia abutments with emergence profile (includes model).",
    includesModel: true,
  },
  {
    id: "denture-or-partial",
    name: "Denture or Partial",
    unitPrice: 30,
    turnaround: "48-72 hours",
    description: "Digital full arches, try-ins, and laser-sintered/castable partial framework designs.",
    includesModel: false,
  },
] as const;

export type DentalServiceName = (typeof DENTAL_SERVICES)[number]["name"];

export function getServiceByName(name: string) {
  return DENTAL_SERVICES.find((s) => s.name.toLowerCase() === name.toLowerCase()) || DENTAL_SERVICES[0];
}

export function calculateCasePrice(serviceName: string, units: number = 1): number {
  const service = getServiceByName(serviceName);
  const count = Math.max(1, Number(units) || 1);
  return service.unitPrice * count;
}

export const CASE_STATUS_CONFIG = {
  uploaded: {
    label: "Uploaded",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    description: "Case submitted and pending designer assignment",
  },
  assigned: {
    label: "Assigned",
    color: "bg-sky-50 text-sky-800 border-sky-200",
    dot: "bg-sky-500",
    description: "CAD designer assigned and currently designing",
  },
  done: {
    label: "Done",
    color: "bg-[#E8F8F2] text-[#008F66] border-[#B6EAD5]",
    dot: "bg-[#00C48C]",
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
