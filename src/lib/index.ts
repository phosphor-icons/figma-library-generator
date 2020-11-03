import { Icon } from "phosphor-react";

export enum IconStyle {
  THIN = "thin",
  LIGHT = "light",
  REGULAR = "regular",
  BOLD = "bold",
  FILL = "fill",
  DUOTONE = "duotone",
}

export enum IconCategory {
  ARROWS = "arrows",
  BRAND = "brands",
  COMMERCE = "commerce",
  COMMUNICATION = "communications",
  DESIGN = "design",
  DEVELOPMENT = "development",
  GAMES = "games",
  HEALTH = "health & wellness",
  MAP = "maps & transportation",
  FINANCE = "math & finances",
  MEDIA = "media",
  OFFICE = "office",
  PEOPLE = "people",
  SECURITY = "security & warnings",
  SYSTEM = "system",
  TIME = "time & date",
  WEATHER = "weather & nature",
}

export interface IconEntry {
  name: string;
  category: IconCategory;
  tags: string[];
  Icon: Icon;
}
