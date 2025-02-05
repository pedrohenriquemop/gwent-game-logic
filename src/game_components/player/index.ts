import { PlayerRole } from "../../utils/types";
import Deck from "../deck";

export default class Player {
  readonly id: string;
  readonly name: string;
  readonly role: PlayerRole;
  readonly deck: Deck;

  constructor(id: string, name: string, role: PlayerRole, deck: Deck) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.deck = deck;
  }
}
