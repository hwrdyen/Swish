export type GameData = {
  id: string;
  game_date: Date;
  home_team_score?: number;
  away_team_score?: number;
  createdAt: Date;
  updatedAt: Date;

  // Define home_team and away_team as foreign keys
  home_team_id: string;
  away_team_id: string;

  // Define the relationship with the Tournament model (Many-to-One relation)
  tournament_id: string;
};
