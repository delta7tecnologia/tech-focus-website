export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      asset_licenses: {
        Row: {
          activation_date: string | null
          asset_id: string
          category: string
          created_at: string
          created_by: string | null
          edition: string | null
          id: string
          license_key: string | null
          notes: string | null
          product: string
          updated_at: string
        }
        Insert: {
          activation_date?: string | null
          asset_id: string
          category: string
          created_at?: string
          created_by?: string | null
          edition?: string | null
          id?: string
          license_key?: string | null
          notes?: string | null
          product: string
          updated_at?: string
        }
        Update: {
          activation_date?: string | null
          asset_id?: string
          category?: string
          created_at?: string
          created_by?: string | null
          edition?: string | null
          id?: string
          license_key?: string | null
          notes?: string | null
          product?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_licenses_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          company_name: string
          created_at: string
          created_by: string
          id: string
          is_external_screenshot: boolean
          machine_name: string
          notes: string | null
          office_activation_date: string | null
          office_license: string | null
          screenshot_url: string | null
          updated_at: string
          windows_activation_date: string | null
          windows_license: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          created_by: string
          id?: string
          is_external_screenshot?: boolean
          machine_name: string
          notes?: string | null
          office_activation_date?: string | null
          office_license?: string | null
          screenshot_url?: string | null
          updated_at?: string
          windows_activation_date?: string | null
          windows_license?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          created_by?: string
          id?: string
          is_external_screenshot?: boolean
          machine_name?: string
          notes?: string | null
          office_activation_date?: string | null
          office_license?: string | null
          screenshot_url?: string | null
          updated_at?: string
          windows_activation_date?: string | null
          windows_license?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          document: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          order_index: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          document?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          order_index?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          document?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          order_index?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      commercial_proposals: {
        Row: {
          activation_fee: number
          audit_log: Json
          client_address: string | null
          client_contact: string | null
          client_document: string | null
          client_email: string | null
          client_name: string
          created_at: string
          created_by: string
          discount: number
          generated_at: string
          id: string
          integrity_hash: string | null
          is_draft: boolean
          items: Json
          locked: boolean
          monthly_total: number
          notes: string | null
          proposal_number: string
          proposal_seq: number | null
          sales_rep_email: string | null
          sales_rep_name: string
          sections: Json | null
          setup_total: number
          status: string
          updated_at: string
          validity_days: number
        }
        Insert: {
          activation_fee?: number
          audit_log?: Json
          client_address?: string | null
          client_contact?: string | null
          client_document?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          created_by: string
          discount?: number
          generated_at?: string
          id?: string
          integrity_hash?: string | null
          is_draft?: boolean
          items?: Json
          locked?: boolean
          monthly_total?: number
          notes?: string | null
          proposal_number: string
          proposal_seq?: number | null
          sales_rep_email?: string | null
          sales_rep_name: string
          sections?: Json | null
          setup_total?: number
          status?: string
          updated_at?: string
          validity_days?: number
        }
        Update: {
          activation_fee?: number
          audit_log?: Json
          client_address?: string | null
          client_contact?: string | null
          client_document?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string
          discount?: number
          generated_at?: string
          id?: string
          integrity_hash?: string | null
          is_draft?: boolean
          items?: Json
          locked?: boolean
          monthly_total?: number
          notes?: string | null
          proposal_number?: string
          proposal_seq?: number | null
          sales_rep_email?: string | null
          sales_rep_name?: string
          sections?: Json | null
          setup_total?: number
          status?: string
          updated_at?: string
          validity_days?: number
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean | null
          order_index: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          activated_at: string | null
          activation_instructions: string | null
          created_at: string
          encrypted_serial: string
          id: string
          is_activated: boolean | null
          license_key: string
          order_id: string
          product_id: string
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          activation_instructions?: string | null
          created_at?: string
          encrypted_serial: string
          id?: string
          is_activated?: boolean | null
          license_key: string
          order_id: string
          product_id: string
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          activation_instructions?: string | null
          created_at?: string
          encrypted_serial?: string
          id?: string
          is_activated?: boolean | null
          license_key?: string
          order_id?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          customer_tax_id: string | null
          discount: number | null
          id: string
          items: Json
          notes: string | null
          payment_id: string | null
          payment_method: string
          payment_status: string
          payment_url: string | null
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          discount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          payment_id?: string | null
          payment_method?: string
          payment_status?: string
          payment_url?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          discount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          payment_id?: string | null
          payment_method?: string
          payment_status?: string
          payment_url?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          order_index: number | null
          price: number | null
          short_description: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          order_index?: number | null
          price?: number | null
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          price?: number | null
          short_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          can_edit_reports: boolean
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_approved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          can_edit_reports?: boolean
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_approved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          can_edit_reports?: boolean
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_approved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      report_signature_links: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          id: string
          report_id: string
          signature_data: string | null
          signed_at: string | null
          signed_ip: string | null
          signer_email: string | null
          signer_name: string | null
          signer_role: string
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string
          id?: string
          report_id: string
          signature_data?: string | null
          signed_at?: string | null
          signed_ip?: string | null
          signer_email?: string | null
          signer_name?: string | null
          signer_role: string
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          report_id?: string
          signature_data?: string | null
          signed_at?: string | null
          signed_ip?: string | null
          signer_email?: string | null
          signer_name?: string | null
          signer_role?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_order_signature_links: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          id: string
          service_order_id: string
          signature_data: string | null
          signed_at: string | null
          signed_ip: string | null
          signer_document: string | null
          signer_email: string | null
          signer_name: string | null
          signer_role: string
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string
          id?: string
          service_order_id: string
          signature_data?: string | null
          signed_at?: string | null
          signed_ip?: string | null
          signer_document?: string | null
          signer_email?: string | null
          signer_name?: string | null
          signer_role: string
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          service_order_id?: string
          signature_data?: string | null
          signed_at?: string | null
          signed_ip?: string | null
          signer_document?: string | null
          signer_email?: string | null
          signer_name?: string | null
          signer_role?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_orders: {
        Row: {
          audit_log: Json
          checkin_accuracy: number | null
          checkin_at: string | null
          checkin_lat: number | null
          checkin_lng: number | null
          checklist: Json
          checkout_accuracy: number | null
          checkout_at: string | null
          checkout_lat: number | null
          checkout_lng: number | null
          client_address: string
          client_contact: string | null
          client_name: string
          created_at: string
          created_by: string
          evidences: Json
          finished_at: string | null
          generated_at: string
          id: string
          integrity_hash: string | null
          is_draft: boolean
          locked: boolean
          materials: Json
          os_number: string
          os_seq: number | null
          requested_by: string | null
          requested_by_role: string | null
          scheduled_at: string | null
          signature_data: string | null
          signed_at: string | null
          signer_document: string | null
          signer_name: string | null
          signer_role: string | null
          started_at: string | null
          status: string
          summary: string | null
          technician_id: string
          technician_name: string
          travel: Json
          updated_at: string
          visit_type: string
        }
        Insert: {
          audit_log?: Json
          checkin_accuracy?: number | null
          checkin_at?: string | null
          checkin_lat?: number | null
          checkin_lng?: number | null
          checklist?: Json
          checkout_accuracy?: number | null
          checkout_at?: string | null
          checkout_lat?: number | null
          checkout_lng?: number | null
          client_address: string
          client_contact?: string | null
          client_name: string
          created_at?: string
          created_by: string
          evidences?: Json
          finished_at?: string | null
          generated_at?: string
          id?: string
          integrity_hash?: string | null
          is_draft?: boolean
          locked?: boolean
          materials?: Json
          os_number: string
          os_seq?: number | null
          requested_by?: string | null
          requested_by_role?: string | null
          scheduled_at?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signer_document?: string | null
          signer_name?: string | null
          signer_role?: string | null
          started_at?: string | null
          status?: string
          summary?: string | null
          technician_id: string
          technician_name: string
          travel?: Json
          updated_at?: string
          visit_type?: string
        }
        Update: {
          audit_log?: Json
          checkin_accuracy?: number | null
          checkin_at?: string | null
          checkin_lat?: number | null
          checkin_lng?: number | null
          checklist?: Json
          checkout_accuracy?: number | null
          checkout_at?: string | null
          checkout_lat?: number | null
          checkout_lng?: number | null
          client_address?: string
          client_contact?: string | null
          client_name?: string
          created_at?: string
          created_by?: string
          evidences?: Json
          finished_at?: string | null
          generated_at?: string
          id?: string
          integrity_hash?: string | null
          is_draft?: boolean
          locked?: boolean
          materials?: Json
          os_number?: string
          os_seq?: number | null
          requested_by?: string | null
          requested_by_role?: string | null
          scheduled_at?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signer_document?: string | null
          signer_name?: string | null
          signer_role?: string | null
          started_at?: string | null
          status?: string
          summary?: string | null
          technician_id?: string
          technician_name?: string
          travel?: Json
          updated_at?: string
          visit_type?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          order_index: number | null
          short_description: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          order_index?: number | null
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          short_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      technical_files: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          external_provider: string | null
          external_url: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_external: boolean
          mime_type: string | null
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_provider?: string | null
          external_url?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_external?: boolean
          mime_type?: string | null
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_provider?: string | null
          external_url?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_external?: boolean
          mime_type?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      technical_reports: {
        Row: {
          company_name: string
          conclusao: Json
          created_at: string
          created_by: string
          diagnostico: Json
          equipment: string
          form_data: Json | null
          generated_at: string
          id: string
          integrity_hash: string
          is_draft: boolean
          photos: Json
          report_number: string
          report_type: string
          signature_history: Json
          status_final: string
          technician_name: string
          triagem: Json
          updated_at: string
        }
        Insert: {
          company_name: string
          conclusao?: Json
          created_at?: string
          created_by: string
          diagnostico?: Json
          equipment: string
          form_data?: Json | null
          generated_at?: string
          id?: string
          integrity_hash: string
          is_draft?: boolean
          photos?: Json
          report_number: string
          report_type?: string
          signature_history?: Json
          status_final?: string
          technician_name: string
          triagem?: Json
          updated_at?: string
        }
        Update: {
          company_name?: string
          conclusao?: Json
          created_at?: string
          created_by?: string
          diagnostico?: Json
          equipment?: string
          form_data?: Json | null
          generated_at?: string
          id?: string
          integrity_hash?: string
          is_draft?: boolean
          photos?: Json
          report_number?: string
          report_type?: string
          signature_history?: Json
          status_final?: string
          technician_name?: string
          triagem?: Json
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_name: string
          company: string | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          position: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          client_name: string
          company?: string | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          position?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          client_name?: string
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          position?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      useful_links: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_valid_http_url: { Args: { url: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
