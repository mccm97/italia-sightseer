export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          is_superadmin: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          is_superadmin?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          is_superadmin?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      attractions: {
        Row: {
          city_id: string | null
          created_at: string
          id: string
          lat: number
          lng: number
          name: string
          price: number | null
          visit_duration: number
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          id?: string
          lat: number
          lng: number
          name: string
          price?: number | null
          visit_duration: number
        }
        Update: {
          city_id?: string | null
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          price?: number | null
          visit_duration?: number
        }
        Relationships: [
          {
            foreignKeyName: "attractions_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string | null
          id: string
          lat: number
          lng: number
          name: string
        }
        Insert: {
          country?: string | null
          id?: string
          lat: number
          lng: number
          name: string
        }
        Update: {
          country?: string | null
          id?: string
          lat?: number
          lng?: number
          name?: string
        }
        Relationships: []
      }
      city_images: {
        Row: {
          city_id: string | null
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_images_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          is_public: boolean | null
          last_route_created_at: string | null
          subscription_level: Database["public"]["Enums"]["subscription_level"]
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          is_public?: boolean | null
          last_route_created_at?: string | null
          subscription_level?: Database["public"]["Enums"]["subscription_level"]
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          last_route_created_at?: string | null
          subscription_level?: Database["public"]["Enums"]["subscription_level"]
          username?: string | null
        }
        Relationships: []
      }
      route_attractions: {
        Row: {
          attraction_id: string
          created_at: string
          id: string
          order_index: number
          route_id: string
          transport_mode: string
          travel_distance: number
          travel_duration: number
        }
        Insert: {
          attraction_id: string
          created_at?: string
          id?: string
          order_index: number
          route_id: string
          transport_mode: string
          travel_distance: number
          travel_duration: number
        }
        Update: {
          attraction_id?: string
          created_at?: string
          id?: string
          order_index?: number
          route_id?: string
          transport_mode?: string
          travel_distance?: number
          travel_duration?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_attractions_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "attractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_attractions_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      route_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          route_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          route_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          route_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_comments_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      route_likes: {
        Row: {
          created_at: string
          id: string
          route_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          route_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          route_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_likes_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      route_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          route_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          route_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          route_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_ratings_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          city_id: string
          country: string | null
          created_at: string
          directions: Json | null
          id: string
          is_public: boolean | null
          name: string
          total_distance: number
          total_duration: number
          transport_mode: string
          user_id: string
        }
        Insert: {
          city_id: string
          country?: string | null
          created_at?: string
          directions?: Json | null
          id?: string
          is_public?: boolean | null
          name: string
          total_distance: number
          total_duration: number
          transport_mode: string
          user_id: string
        }
        Update: {
          city_id?: string
          country?: string | null
          created_at?: string
          directions?: Json | null
          id?: string
          is_public?: boolean | null
          name?: string
          total_distance?: number
          total_duration?: number
          transport_mode?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_limits: {
        Row: {
          max_routes_per_month: number | null
          subscription_level: string
        }
        Insert: {
          max_routes_per_month?: number | null
          subscription_level: string
        }
        Update: {
          max_routes_per_month?: number | null
          subscription_level?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_route: {
        Args: {
          input_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      subscription_level: "bronze" | "silver" | "gold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
