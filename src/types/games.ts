export interface Game {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  min_players: number;
  max_players: number;
  min_play_time: number; // in minutes
  max_play_time: number; // in minutes
  age_recommendation: number;
  publisher: string;
  year_published: number;
  image_url: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface ListGamesOutput {
  games: Game[];
  pagination: Pagination;
}
