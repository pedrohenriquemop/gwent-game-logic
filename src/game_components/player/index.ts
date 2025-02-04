import { PlayerRole } from "../../utils/types";
import Deck from "../deck";

export default class Player {
  private id: string;
  private name: string;
  private role: PlayerRole;
  private deck: Deck;

  constructor(id: string, name: string, role: PlayerRole) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getRole(): PlayerRole {
    return this.role;
  }
}
