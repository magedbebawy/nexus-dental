export type UserRole = "customer" | "designer" | "admin";
export type CaseStatus = "uploaded" | "assigned" | "done";
export type FileCategory = "customer_file" | "designer_file";

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
    };
  };
}
