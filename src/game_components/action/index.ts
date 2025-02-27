import { PlayerActionType, PlayerRole } from "../../utils/types";
import Card from "../card";

export abstract class PlayerAction {
  readonly type: PlayerActionType;
  readonly agent: PlayerRole;
  protected resolved: boolean;

  constructor(name: PlayerActionType, agent: PlayerRole) {
    this.type = name;
    this.agent = agent;
    this.resolved = false;
  }

  isResolved() {
    return this.resolved;
  }

  abstract resolve(...args: unknown[]): this;
}

export class SelectCardFromSetAction extends PlayerAction {
  private cardSet: Card[];
  private selectedCard: Card | null;

  constructor(agent: PlayerRole, cardSet: Card[]) {
    super(PlayerActionType.SELECT_CARD_FROM_SET, agent);
    this.cardSet = cardSet;
    this.selectedCard = null;
  }

  resolve(selectedCardIndex: number) {
    if (selectedCardIndex < 0 || selectedCardIndex >= this.cardSet.length) {
      throw new Error("Invalid card index");
    }

    this.selectedCard = this.cardSet[selectedCardIndex];

    this.resolved = true;

    return this;
  }

  getSelectedCard() {
    return this.selectedCard;
  }
}

export class PassAction extends PlayerAction {
  constructor(agent: PlayerRole) {
    super(PlayerActionType.PASS, agent);
  }

  resolve() {
    this.resolved = true;

    return this;
  }
}
