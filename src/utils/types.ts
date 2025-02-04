export enum PlayerRole {
  PLAYER_1 = "player1",
  PLAYER_2 = "player2",
  SPECTATOR = "spectator",
}

export enum BoardRow {
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
  readonly faction: Faction;
  readonly type: CardType;
  readonly allowedRows: BoardRow[],
  readonly specialAbilities?: string[], // TODO: create a dedicated type for the different special abilities
};
