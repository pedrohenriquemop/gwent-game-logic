import { Faction, PlayerRole } from "../../../../utils/types";
import Deck from "../../../deck";
import {
  validMonsterDeckCards,
  validMonsterLeader,
} from "../../../deck/tests/mocks/deck.mock";
import Player from "../../../player";
import User from "../../../user";

export const mockedMonsterDeck = new Deck(
  validMonsterDeckCards,
  Faction.MONSTERS,
  validMonsterLeader,
);

export const mockedUser1 = new User("1", "user_001");
export const mockedUser2 = new User("2", "user_002");

export const mockedPlayer1 = new Player(
  mockedUser1,
  PlayerRole.PLAYER_1,
  mockedMonsterDeck,
);

export const mockedPlayer2 = new Player(
  mockedUser2,
  PlayerRole.PLAYER_2,
  mockedMonsterDeck,
);
