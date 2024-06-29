export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			books: {
				Row: {
					author: string;
					description: string;
					description_embedding: string | null;
					epub: string;
					epub_file_name: string;
					fts: unknown;
					genres: string[];
					id: number;
					image: string;
					image_file_name: string;
					image_scaled: string;
					is_featured: boolean;
					short_description: string;
					title: string;
				};
				Insert: {
					author: string;
					description: string;
					description_embedding?: string | null;
					epub: string;
					epub_file_name: string;
					fts?: unknown;
					genres: string[];
					id?: number;
					image: string;
					image_file_name: string;
					image_scaled: string;
					is_featured?: boolean;
					short_description: string;
					title: string;
				};
				Update: {
					author?: string;
					description?: string;
					description_embedding?: string | null;
					epub?: string;
					epub_file_name?: string;
					fts?: unknown;
					genres?: string[];
					id?: number;
					image?: string;
					image_file_name?: string;
					image_scaled?: string;
					is_featured?: boolean;
					short_description?: string;
					title?: string;
				};
				Relationships: [];
			};
			user_library: {
				Row: {
					book_id: number;
					user_id: string;
				};
				Insert: {
					book_id: number;
					user_id: string;
				};
				Update: {
					book_id?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_library_book_id_fkey";
						columns: ["book_id"];
						isOneToOne: false;
						referencedRelation: "books";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_library_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			book_recommendations: {
				Args: {
					book_id: number;
					match_threshold: number;
					match_limit: number;
				};
				Returns: {
					author: string;
					description: string;
					description_embedding: string | null;
					epub: string;
					epub_file_name: string;
					fts: unknown;
					genres: string[];
					id: number;
					image: string;
					image_file_name: string;
					image_scaled: string;
					is_featured: boolean;
					short_description: string;
					title: string;
				}[];
			};
			comma_join: {
				Args: {
					"": string[];
				};
				Returns: string;
			};
			hybrid_book_search: {
				Args: {
					query: string;
					query_embedding: string;
					match_limit: number;
					fts_weight?: number;
					semantic_weight?: number;
					smoothing?: number;
				};
				Returns: {
					author: string;
					description: string;
					description_embedding: string | null;
					epub: string;
					epub_file_name: string;
					fts: unknown;
					genres: string[];
					id: number;
					image: string;
					image_file_name: string;
					image_scaled: string;
					is_featured: boolean;
					short_description: string;
					title: string;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;
