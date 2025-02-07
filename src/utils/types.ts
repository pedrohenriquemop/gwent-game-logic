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

export enum Faction {
  NORTHERN_REALMS = "northern_realms",
  NILFGAARDIAN_EMPIRE = "nilfgaardian_empire",
  SCOIATAEL = "scoiatael",
  MONSTERS = "monsters",
  SKELLIGE = "skellige",
  NEUTRAL = "neutral",
}

export enum CardType {
  UNIT = "unit",
  SPECIAL = "special", // decoy, horn, scorch, etc.
  HERO = "hero",
  WEATHER = "weather",
  LEADER = "leader",
}

export interface Card {
  readonly id: number;
  readonly semanticId: string;
  readonly name: string;
  readonly flavourText: string;
  readonly baseStrength: number;
  calculatedStrength: number;
  readonly faction: Faction;
  readonly type: CardType;
  readonly allowedRows: BoardRowType[];
  readonly specialAbilities?: SpecialAbility[];
  readonly isHiddenCard?: boolean;
}

export enum SpecialAbility {
  AGILE = "agile",
  MEDIC = "medic",
  MORALE_BOOST = "morale_boost",
  MUSTER = "muster",
  SPY = "spy",
  TIGHT_BOND = "tight_bond",
  DECOY = "decoy",
  SCORCH = "scorch",
  HORN = "horn",
  MARDROEM = "mardroem",
  BERSERK = "berserk",
  SUMMON_AVENGER = "summon_avenger",
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
