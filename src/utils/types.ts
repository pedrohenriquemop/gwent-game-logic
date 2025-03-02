export enum PlayerRole {
  PLAYER_1 = "player1",
  PLAYER_2 = "player2",
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
  SPECIAL = "special", // decoy, horn, scorch, weather, etc.
  LEADER = "leader",
}

export interface CardInterface {
  readonly id: number;
  readonly semanticId: string;
  readonly name: string;
  readonly flavourText: string;
  readonly baseStrength: number;
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
  MARDROEME = "mardroeme",
  BERSERK = "berserk",
  SUMMON_AVENGER = "summon_avenger",
  WEATHER = "weather",
  CLEAR_WEATHER = "clear_weather",
  HERO = "hero",
}

export enum WeatherEffect {
  FROST = "frost",
  FOG = "fog",
  RAIN = "rain",
  CLEAR = "clear",
}

export enum RowEffect {
  HORN = "horn",
  MARDROEME = "mardroeme",
  TIGHT_BOND = "tight_bond",
  WEATHER = "weather",
  MORALE_BOOST = "morale_boost",
}

export enum UniqueRowEffect {
  HORN = "horn",
  MARDROEME = "mardroeme",
}

export enum GameStatus {
  WAITING = "waiting",
  READY = "ready",
  FINISHED = "finished",
}

export enum PlayerActionType {
  PASS = "PASS",
  SELECT_CARD_FROM_SET = "SELECT_CARD_FROM_SET",
}
