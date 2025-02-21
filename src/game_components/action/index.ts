import { PlayerRole } from "../../utils/types";
import Card from "../card";

export abstract class PlayerAction {
  readonly name: string;
  readonly agent: PlayerRole;
  protected resolved: boolean;

  constructor(name: string, agent: PlayerRole) {
    this.name = name;
    this.agent = agent;
    this.resolved = false;
  }

  isResolved() {
    return this.resolved;
  }

  abstract resolve(...args: unknown[]): void;
}

export class SelectCardFromSetAction extends PlayerAction {
  private cardSet: Card[];
  private selectedCard: Card | null;

  constructor(agent: PlayerRole, cardSet: Card[]) {
    super("SELECT_CARD_FROM_SET", agent);
    this.cardSet = cardSet;
    this.selectedCard = null;
  }

  resolve(selectedCardIndex: number) {
    if (selectedCardIndex < 0 || selectedCardIndex >= this.cardSet.length) {
      throw new Error("Invalid card index");
    }

    this.selectedCard = this.cardSet[selectedCardIndex];

    this.resolved = true;
  }

  getSelectedCard() {
    return this.selectedCard;
  }
}

export class PassAction extends PlayerAction {
  constructor(agent: PlayerRole) {
    super("PASS", agent);
  }

  resolve() {
    this.resolved = true;
  }
}
