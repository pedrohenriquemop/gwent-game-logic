import {
  MAXIMUM_NUMBER_OF_SPECIAL_CARDS_IN_DECK,
  MINIMUM_NUMBER_OF_UNIT_CARDS_IN_DECK,
} from "../../utils/constants";
import { CardType, Faction } from "../../utils/types";
import Card from "../card";

export default class Deck {
  readonly cards: Card[];
  readonly faction: Faction;
  readonly leader: Card;

  constructor(cards: Card[], faction: Faction, leader: Card) {
    this.cards = cards;
    this.faction = faction;
    this.leader = leader;
  }

  getTotalNumberOfCards(): number {
    return this.cards.length;
  }

  getNumberOfUnitCards(): number {
    return this.getNumberOfCardsByType(CardType.UNIT);
  }

  getNumberOfSpecialCards(): number {
    return this.getNumberOfCardsByType(CardType.SPECIAL);
  }

  getnumberOfHeroCards(): number {
    return this.getNumberOfCardsByType(CardType.HERO);
  }

  getTotalCardStrength(): number {
    return this.cards.reduce((acc, card) => acc + card.baseStrength, 0);
  }

  getNumberOfCardsByType(type: CardType): number {
    return this.cards.filter((card) => card.type === type).length;
  }

  private validateLeader(): void {
    const leaderType = this.leader.type;
    const leaderFaction = this.leader.faction;

    if (leaderType !== CardType.LEADER) {
      throw new Error("Invalid leader type");
    }

    if (leaderFaction !== this.faction) {
      throw new Error("Invalid leader faction");
    }
  }

  private validateDeckSize(): void {
    if (this.getNumberOfUnitCards() < MINIMUM_NUMBER_OF_UNIT_CARDS_IN_DECK) {
      throw new Error("There must be at least 22 unit cards in the deck");
    }
    if (
      this.getNumberOfSpecialCards() > MAXIMUM_NUMBER_OF_SPECIAL_CARDS_IN_DECK
    ) {
      throw new Error("There must be at most 10 special cards in the deck");
    }
  }

  private validateDeckFaction(): void {
    this.cards.forEach((card) => {
      if (card.faction !== Faction.NEUTRAL && card.faction !== this.faction) {
        throw new Error(`Invalid faction for card ${card.name}`);
      }
    });
  }

  validateDeck(): Error | null {
    try {
      this.validateLeader();
      this.validateDeckSize();
      this.validateDeckFaction();
      return null;
    } catch (error: unknown) {
      return error instanceof Error ? error : new Error(String(error));
    }
  }
}
