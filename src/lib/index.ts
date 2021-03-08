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
  COMMUNICATION = "communication",
  DESIGN = "design",
  DEVELOPMENT = "technology & development",
  EDUCATION = "education",
  GAMES = "games",
  HEALTH = "health & wellness",
  MAP = "maps & tavel",
  FINANCE = "math & finance",
  MEDIA = "media",
  OFFICE = "office & editing",
  PEOPLE = "people",
  SECURITY = "security & warnings",
  SYSTEM = "system & devices",
  TIME = "time",
  WEATHER = "weather & nature",
}

export interface IconEntry {
  name: string;
  category: IconCategory;
  tags: string[];
  Icon: Icon;
}
