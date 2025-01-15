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
      blog_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          post_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          post_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          city_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            isOneToOne: true
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      city_ratings: {
        Row: {
          city_id: string
          cleanliness: number
          comment: string | null
          cost_of_living: number
          created_at: string
          cultural_attractions: number
          food_quality: number
          id: string
          nightlife: number
          safety: number
          transportation: number
          user_id: string
        }
        Insert: {
          city_id: string
          cleanliness: number
          comment?: string | null
          cost_of_living: number
          created_at?: string
          cultural_attractions: number
          food_quality: number
          id?: string
          nightlife: number
          safety: number
          transportation: number
          user_id: string
        }
        Update: {
          city_id?: string
          cleanliness?: number
          comment?: string | null
          cost_of_living?: number
          created_at?: string
          cultural_attractions?: number
          food_quality?: number
          id?: string
          nightlife?: number
          safety?: number
          transportation?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_ratings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          image_url: string | null
          reply_to_id: string | null
          route_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          reply_to_id?: string | null
          route_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          reply_to_id?: string | null
          route_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_comments_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "route_comments"
            referencedColumns: ["id"]
          },
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
          description: string | null
          directions: Json | null
          id: string
          image_url: string | null
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
          description?: string | null
          directions?: Json | null
          id?: string
          image_url?: string | null
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
          description?: string | null
          directions?: Json | null
          id?: string
          image_url?: string | null
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
      saved_routes: {
        Row: {
          created_at: string
          id: string
          route_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          route_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          route_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_routes_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_routes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      screenshots: {
        Row: {
          id: string
          route_id: string | null
          screenshot_url: string | null
        }
        Insert: {
          id?: string
          route_id?: string | null
          screenshot_url?: string | null
        }
        Update: {
          id?: string
          route_id?: string | null
          screenshot_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screenshots_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      site_statistics: {
        Row: {
          created_at: string
          date: string
          id: string
          likes_count: number | null
          reviews_count: number | null
          routes_created: number | null
          visits_count: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          likes_count?: number | null
          reviews_count?: number | null
          routes_created?: number | null
          visits_count?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          likes_count?: number | null
          reviews_count?: number | null
          routes_created?: number | null
          visits_count?: number | null
        }
        Relationships: []
      }
      subscription_limits: {
        Row: {
          icon_color: string
          max_routes_per_month: number | null
          subscription_level: string
        }
        Insert: {
          icon_color?: string
          max_routes_per_month?: number | null
          subscription_level: string
        }
        Update: {
          icon_color?: string
          max_routes_per_month?: number | null
          subscription_level?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      create_route: {
        Args: {
          route_data: Json
        }
        Returns: undefined
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
