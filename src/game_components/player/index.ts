import { PlayerRole } from "../../utils/types";
import Deck from "../deck";

export default class Player {
  public readonly id: string;
  public readonly name: string;
  public readonly role: PlayerRole;
  public readonly deck: Deck;

  constructor(id: string, name: string, role: PlayerRole, deck: Deck) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.deck = deck;
  }
}
