import { TeamData } from "./team-config";
import { GameData } from "./game-config";

export type TourData = {
  id: string;
  tournament_name: string;
  tournament_avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  // Define Many-to-Many relationship with teams
  team_list: TeamData[];

  // Define One-to-Many relationship with games
  game_list?: GameData[];
};
