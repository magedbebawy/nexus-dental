export type UserRole = "customer" | "designer" | "admin";
export type CaseStatus = "uploaded" | "assigned" | "done";
export type FileCategory = "customer_file" | "designer_file";
export type InvoiceStatus = "unpaid" | "paid" | "void";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  case_number: string;
  customer_id: string;
  designer_id: string | null;
  service: string;
  units: number;
  unit_price: number;
  total_price: number;
  admin_verified?: boolean;
  invoice_id?: string | null;
  patient_reference: string;
  due_date: string;
  instructions: string | null;
  status: CaseStatus;
  created_at: string;
  completed_at: string | null;
  // Joined fields
  customer?: Profile;
  designer?: Profile | null;
  files?: CaseFile[];
}

export interface CaseFile {
  id: string;
  case_id: string;
  uploaded_by: string;
  file_category: FileCategory;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
  // Joined / runtime fields
  uploader?: Profile;
  download_url?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  amount_due: number;
  amount_paid: number;
  status: InvoiceStatus;
  billing_period_start: string;
  billing_period_end: string;
  due_date: string;
  stripe_invoice_id?: string | null;
  stripe_payment_url?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: Profile;
  cases?: Case[];
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          name: string;
          email: string;
          phone_number?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone_number?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      cases: {
        Row: Case;
        Insert: {
          id?: string;
          case_number?: string;
          customer_id: string;
          designer_id?: string | null;
          service: string;
          units?: number;
          unit_price?: number;
          total_price?: number;
          admin_verified?: boolean;
          invoice_id?: string | null;
          patient_reference: string;
          due_date: string;
          instructions?: string | null;
          status?: CaseStatus;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          case_number?: string;
          customer_id?: string;
          designer_id?: string | null;
          service?: string;
          units?: number;
          unit_price?: number;
          total_price?: number;
          admin_verified?: boolean;
          invoice_id?: string | null;
          patient_reference?: string;
          due_date?: string;
          instructions?: string | null;
          status?: CaseStatus;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      case_files: {
        Row: CaseFile;
        Insert: {
          id?: string;
          case_id: string;
          uploaded_by: string;
          file_category: FileCategory;
          file_name: string;
          file_type: string;
          file_size?: number;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          uploaded_by?: string;
          file_category?: FileCategory;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          storage_path?: string;
          created_at?: string;
        };
      };
      invoices: {
        Row: Invoice;
        Insert: {
          id?: string;
          invoice_number: string;
          customer_id: string;
          amount_due: number;
          amount_paid?: number;
          status?: InvoiceStatus;
          billing_period_start: string;
          billing_period_end: string;
          due_date: string;
          stripe_invoice_id?: string | null;
          stripe_payment_url?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          customer_id?: string;
          amount_due?: number;
          amount_paid?: number;
          status?: InvoiceStatus;
          billing_period_start?: string;
          billing_period_end?: string;
          due_date?: string;
          stripe_invoice_id?: string | null;
          stripe_payment_url?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
