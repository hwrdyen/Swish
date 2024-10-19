import { UserProfile } from "./user-config";

export type TeamData = {
  id: string;
  team_name: string;
  team_avatar?: string;
  team_creator_id: string;
  coach_list?: UserProfile[];
  player_list?: UserProfile[];
};
