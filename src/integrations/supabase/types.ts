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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      booking_inquiries: {
        Row: {
          conversation_id: string | null
          created_at: string
          email: string
          hospital_id: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          email: string
          hospital_id?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          email?: string
          hospital_id?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_inquiries_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_inquiries_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cost_estimates: {
        Row: {
          breakdown: Json
          conversation_id: string
          created_at: string
          estimate_high: number | null
          estimate_low: number | null
          id: string
        }
        Insert: {
          breakdown?: Json
          conversation_id: string
          created_at?: string
          estimate_high?: number | null
          estimate_low?: number | null
          id?: string
        }
        Update: {
          breakdown?: Json
          conversation_id?: string
          created_at?: string
          estimate_high?: number | null
          estimate_low?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_estimates_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_inquiries: {
        Row: {
          conversation_id: string | null
          created_at: string
          email: string
          hospital_id: string | null
          id: string
          inquiry_type: string
          status: string
          updated_at: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          email: string
          hospital_id?: string | null
          id?: string
          inquiry_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          email?: string
          hospital_id?: string | null
          id?: string
          inquiry_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_inquiries_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_inquiries_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_matches: {
        Row: {
          accreditation: string | null
          conversation_id: string
          created_at: string
          estimated_cost: number | null
          hospital_name: string
          id: string
          location: string
          match_reason: string | null
        }
        Insert: {
          accreditation?: string | null
          conversation_id: string
          created_at?: string
          estimated_cost?: number | null
          hospital_name: string
          id?: string
          location: string
          match_reason?: string | null
        }
        Update: {
          accreditation?: string | null
          conversation_id?: string
          created_at?: string
          estimated_cost?: number | null
          hospital_name?: string
          id?: string
          location?: string
          match_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_matches_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          accreditation_info: string | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          country: string
          created_at: string
          description: string | null
          estimated_cost_high: number | null
          estimated_cost_low: number | null
          id: string
          image_url: string | null
          is_verified: boolean
          jci_accredited: boolean
          location: string
          name: string
          price_range: string
          procedures: string[] | null
          rating: number | null
          source_url: string | null
          specialties: string[] | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          accreditation_info?: string | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          country: string
          created_at?: string
          description?: string | null
          estimated_cost_high?: number | null
          estimated_cost_low?: number | null
          id?: string
          image_url?: string | null
          is_verified?: boolean
          jci_accredited?: boolean
          location: string
          name: string
          price_range: string
          procedures?: string[] | null
          rating?: number | null
          source_url?: string | null
          specialties?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          accreditation_info?: string | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string
          description?: string | null
          estimated_cost_high?: number | null
          estimated_cost_low?: number | null
          id?: string
          image_url?: string | null
          is_verified?: boolean
          jci_accredited?: boolean
          location?: string
          name?: string
          price_range?: string
          procedures?: string[] | null
          rating?: number | null
          source_url?: string | null
          specialties?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      intake_data: {
        Row: {
          budget: string | null
          companions: string | null
          conversation_id: string
          country: string | null
          created_at: string
          hotel_preference: string | null
          id: string
          procedure: string | null
          travel_date: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          companions?: string | null
          conversation_id: string
          country?: string | null
          created_at?: string
          hotel_preference?: string | null
          id?: string
          procedure?: string | null
          travel_date?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          companions?: string | null
          conversation_id?: string
          country?: string | null
          created_at?: string
          hotel_preference?: string | null
          id?: string
          procedure?: string | null
          travel_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_data_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_reviews: {
        Row: {
          booking_id: string | null
          created_at: string
          helpful_count: number
          hospital_id: string
          id: string
          is_verified: boolean
          rating: number
          review_status: Database["public"]["Enums"]["review_status"]
          review_text: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          helpful_count?: number
          hospital_id: string
          id?: string
          is_verified?: boolean
          rating: number
          review_status?: Database["public"]["Enums"]["review_status"]
          review_text: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          helpful_count?: number
          hospital_id?: string
          id?: string
          is_verified?: boolean
          rating?: number
          review_status?: Database["public"]["Enums"]["review_status"]
          review_text?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "verified_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          hospital_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hospital_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hospital_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          budget_range: string | null
          created_at: string
          id: string
          notifications_enabled: boolean | null
          preferred_countries: string[] | null
          preferred_procedures: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          preferred_countries?: string[] | null
          preferred_procedures?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          preferred_countries?: string[] | null
          preferred_procedures?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verified_bookings: {
        Row: {
          booking_date: string
          booking_status: Database["public"]["Enums"]["booking_status"]
          created_at: string
          hospital_id: string
          id: string
          procedure_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_status?: Database["public"]["Enums"]["booking_status"]
          created_at?: string
          hospital_id: string
          id?: string
          procedure_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_status?: Database["public"]["Enums"]["booking_status"]
          created_at?: string
          hospital_id?: string
          id?: string
          procedure_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verified_bookings_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      review_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
