import { createClient } from "@/lib/supabase/client";
import { getServiceByName } from "@/lib/constants/dental";
import type { Case, CaseStatus, UserRole } from "@/lib/types";

// In-memory fallback mock storage for development/preview when Supabase URL is placeholder
const mockCases: Case[] = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    case_number: "NX-100001",
    customer_id: "u1111111-1111-1111-1111-111111111111",
    designer_id: null,
    service: "Crown & Bridge",
    units: 1,
    unit_price: 6,
    total_price: 6,
    admin_verified: false,
    patient_reference: "PT-DOE-789",
    due_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    instructions: "Monolithic zirconia crown on tooth #19. High translucency, light staining on fissures.",
    status: "uploaded",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    completed_at: null,
    customer: {
      id: "u1111111-1111-1111-1111-111111111111",
      name: "Dr. Alex Vance",
      email: "alex.vance@dentalcare.com",
      phone_number: "951-555-0199",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    case_number: "NX-100002",
    customer_id: "u1111111-1111-1111-1111-111111111111",
    designer_id: "d2222222-2222-2222-2222-222222222222",
    service: "Custom Abutment",
    units: 1,
    unit_price: 21,
    total_price: 21,
    admin_verified: true,
    patient_reference: "PT-SMITH-452",
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    instructions: "Custom titanium abutment with emergence profile for site #30. 4.5mm platform.",
    status: "assigned",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    completed_at: null,
    customer: {
      id: "u1111111-1111-1111-1111-111111111111",
      name: "Dr. Alex Vance",
      email: "alex.vance@dentalcare.com",
      phone_number: "951-555-0199",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    designer: {
      id: "d2222222-2222-2222-2222-222222222222",
      name: "Marcus Sterling (Lead CAD)",
      email: "marcus.sterling@nexusdental.com",
      phone_number: "951-334-8942",
      role: "designer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    case_number: "NX-100003",
    customer_id: "u1111111-1111-1111-1111-111111111111",
    designer_id: "d2222222-2222-2222-2222-222222222222",
    service: "Screw Retained",
    units: 2,
    unit_price: 18,
    total_price: 36,
    admin_verified: true,
    patient_reference: "PT-CHEN-881",
    due_date: new Date(Date.now() - 86400000 * 1).toISOString().split("T")[0],
    instructions: "Screw-retained restorations for site #19 and #20. Optical model included.",
    status: "done",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    customer: {
      id: "u1111111-1111-1111-1111-111111111111",
      name: "Dr. Alex Vance",
      email: "alex.vance@dentalcare.com",
      phone_number: "951-555-0199",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    designer: {
      id: "d2222222-2222-2222-2222-222222222222",
      name: "Marcus Sterling (Lead CAD)",
      email: "marcus.sterling@nexusdental.com",
      phone_number: "951-334-8942",
      role: "designer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export async function fetchCases(options?: {
  role?: UserRole;
  userId?: string;
  status?: CaseStatus | "all";
}): Promise<Case[]> {
  try {
    const supabase = createClient();
    let query = (supabase.from("cases") as any)
      .select(`
        *,
        customer:profiles!cases_customer_id_fkey(*),
        designer:profiles!cases_designer_id_fkey(*)
      `)
      .order("created_at", { ascending: false });

    if (options?.role === "customer" && options.userId) {
      query = query.eq("customer_id", options.userId);
    } else if (options?.role === "designer" && options.userId) {
      query = query.eq("designer_id", options.userId);
    }

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return data as unknown as Case[];
  } catch {
    // Fallback to local preview mock if Supabase query fails or credentials are placeholder
  }

  // Filter mock cases
  let result = [...mockCases];
  if (options?.role === "customer" && options.userId) {
    result = result.filter((c) => c.customer_id === options.userId || c.customer_id.startsWith("u1"));
  } else if (options?.role === "designer" && options.userId) {
    result = result.filter((c) => c.designer_id === options.userId || c.designer_id?.startsWith("d2"));
  }

  if (options?.status && options.status !== "all") {
    result = result.filter((c) => c.status === options.status);
  }

  return result;
}

export async function fetchCaseById(id: string): Promise<Case | null> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("cases") as any)
      .select(`
        *,
        customer:profiles!cases_customer_id_fkey(*),
        designer:profiles!cases_designer_id_fkey(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data) return data as unknown as Case;
  } catch {
    // Fallback
  }

  const found = mockCases.find((c) => c.id === id);
  return found || null;
}

export async function createNewCase(params: {
  customer_id: string;
  service: string;
  units?: number;
  patient_reference: string;
  due_date: string;
  instructions?: string;
}): Promise<Case> {
  const unitsCount = Math.max(1, Number(params.units) || 1);
  const serviceDef = getServiceByName(params.service);
  const unitPrice = serviceDef.unitPrice;
  const totalPrice = unitPrice * unitsCount;

  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("cases") as any)
      .insert({
        customer_id: params.customer_id,
        service: params.service,
        units: unitsCount,
        unit_price: unitPrice,
        total_price: totalPrice,
        admin_verified: false,
        patient_reference: params.patient_reference,
        due_date: params.due_date,
        instructions: params.instructions || null,
        status: "uploaded",
      })
      .select()
      .single();

    if (error) throw error;
    if (data) return data as Case;
  } catch {
    // Fallback
  }

  const newMockCase: Case = {
    id: `c-${Date.now()}`,
    case_number: `NX-${100000 + mockCases.length + 1}`,
    customer_id: params.customer_id,
    designer_id: null,
    service: params.service,
    units: unitsCount,
    unit_price: unitPrice,
    total_price: totalPrice,
    admin_verified: false,
    patient_reference: params.patient_reference,
    due_date: params.due_date,
    instructions: params.instructions || null,
    status: "uploaded",
    created_at: new Date().toISOString(),
    completed_at: null,
  };

  mockCases.unshift(newMockCase);
  return newMockCase;
}

export async function assignDesignerToCase(caseId: string, designerId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await (supabase.from("cases") as any)
      .update({
        designer_id: designerId,
        status: "assigned",
      })
      .eq("id", caseId);

    if (error) throw error;
    return true;
  } catch {
    // Fallback
  }

  const target = mockCases.find((c) => c.id === caseId);
  if (target) {
    target.designer_id = designerId;
    target.status = "assigned";
    return true;
  }
  return false;
}

export async function markCaseAsDone(caseId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await (supabase.from("cases") as any)
      .update({
        status: "done",
        completed_at: new Date().toISOString(),
      })
      .eq("id", caseId);

    if (error) throw error;
    return true;
  } catch {
    // Fallback
  }

  const target = mockCases.find((c) => c.id === caseId);
  if (target) {
    target.status = "done";
    target.completed_at = new Date().toISOString();
    return true;
  }
  return false;
}

export async function reopenCase(caseId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await (supabase.from("cases") as any)
      .update({
        status: "assigned",
        completed_at: null,
      })
      .eq("id", caseId);

    if (error) throw error;
    return true;
  } catch {
    // Fallback
  }

  const target = mockCases.find((c) => c.id === caseId);
  if (target) {
    target.status = "assigned";
    target.completed_at = null;
    return true;
  }
  return false;
}

export async function updateCaseUnitsAndPrice(
  caseId: string,
  units: number,
  unitPrice?: number
): Promise<boolean> {
  const unitsCount = Math.max(1, Number(units) || 1);

  try {
    const supabase = createClient();
    // First get current case if unitPrice not provided
    let calculatedUnitPrice = unitPrice;
    if (calculatedUnitPrice === undefined) {
      const { data: c } = await (supabase.from("cases") as any)
        .select("service, unit_price")
        .eq("id", caseId)
        .single();
      calculatedUnitPrice = c?.unit_price || getServiceByName(c?.service || "")?.unitPrice || 6;
    }

    const pricePerUnit = calculatedUnitPrice ?? 6;
    const calculatedTotal = pricePerUnit * unitsCount;

    const { error } = await (supabase.from("cases") as any)
      .update({
        units: unitsCount,
        unit_price: pricePerUnit,
        total_price: calculatedTotal,
        admin_verified: true,
      })
      .eq("id", caseId);

    if (error) throw error;
    return true;
  } catch {
    // Fallback
  }

  const target = mockCases.find((c) => c.id === caseId);
  if (target) {
    target.units = unitsCount;
    if (unitPrice !== undefined) target.unit_price = unitPrice;
    target.total_price = target.unit_price * unitsCount;
    target.admin_verified = true;
    return true;
  }
  return false;
}
