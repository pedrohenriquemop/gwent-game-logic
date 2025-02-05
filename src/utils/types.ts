export enum PlayerRole {
  PLAYER_1 = "player1",
  PLAYER_2 = "player2",
  SPECTATOR = "spectator",
}

export enum BoardRowType {
  MELEE = "melee",
  RANGED = "ranged",
  SIEGE = "siege",
}

export enum CardType {
  UNIT = "unit",
  SPECIAL = "special", // decoy, horn, scorch, etc.
  HERO = "hero",
  WEATHER = "weather",
  LEADER = "leader",
}

export enum Faction {
  NORTHERN_REALMS = "northern_realms",
  NILFGAARD = "nilfgaard",
  SCOIATAEL = "scoiatael",
  MONSTERS = "monsters",
  NEUTRAL = "neutral",
}

export interface Card {
  readonly id: number;
  readonly name: string;
  readonly flavourText: string;
  readonly baseStrength: number;
  calculatedStrength: number;
  readonly faction: Faction;
  readonly type: CardType;
  readonly allowedRows: BoardRowType[];
  readonly specialAbilities?: string[]; // TODO: create a dedicated type for the different special abilities
}

export enum WeatherEffect {
  FROST = "frost",
  FOG = "fog",
  RAIN = "rain",
}

export enum UniqueRowEffect {
  HORN = "horn",
  MARDROEM = "mardroem",
}

export enum CardRowEffect {
  HORN = "horn",
  MARDROEM = "mardroem",
  MORALE_BOOST = "morale_boost",
  TIGHT_BOND = "tight_bond",
}
