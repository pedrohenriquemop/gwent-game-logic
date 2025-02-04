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
