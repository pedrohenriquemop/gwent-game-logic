import {
  MAXIMUM_NUMBER_OF_SPECIAL_CARDS_IN_DECK,
  MINIMUM_NUMBER_OF_UNIT_CARDS_IN_DECK,
} from "../../utils/constants";
import { sampleFromArray, shuffleArray } from "../../utils/helpers";
import {
  CardInterface,
  CardType,
  Faction,
  SpecialAbility,
} from "../../utils/types";
import Card from "../card";

export default class Deck {
  private _cards: Card[];
  readonly faction: Faction;
  readonly leader: Card;

  constructor(
    cards: CardInterface[] | number[],
    faction: Faction,
    leader: CardInterface | number,
  ) {
    this._cards = cards.map((card) => {
      return new Card(card);
    });
    this.faction = faction;
    this.leader = new Card(leader);

    this.shuffleDeck();
  }

  get cards(): Card[] {
    return this._cards;
  }

  shuffleDeck(): void {
    shuffleArray(this._cards);
  }

  sample(numberOfSamples = 1, removeSampled = false): CardInterface[] {
    const [sampledElements, sampledIndexes] = sampleFromArray(
      this._cards,
      numberOfSamples,
    );

    if (removeSampled) {
      this._cards = this._cards.reduce((acc, card, index) => {
        if (!sampledIndexes.includes(index)) {
          acc.push(card);
        }
        return acc;
      }, [] as Card[]);
    }

    return sampledElements;
  }

  getTotalNumberOfCards(): number {
    return this._cards.length;
  }

  getNumberOfUnitCards(): number {
    return this.getNumberOfCardsByType(CardType.UNIT);
  }

  getNumberOfSpecialCards(): number {
    return this.getNumberOfCardsByType(CardType.SPECIAL);
  }

  getnumberOfHeroCards(): number {
    return this._cards.filter((card) =>
      card.specialAbilities?.includes(SpecialAbility.HERO),
    ).length;
  }

  getNumberOfCardsByType(type: CardType): number {
    return this._cards.filter((card) => card.type === type).length;
  }

  getTotalCardStrength(): number {
    return this._cards.reduce((acc, card) => acc + card.baseStrength, 0);
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
    this._cards.forEach((card) => {
      if (card.faction !== Faction.NEUTRAL && card.faction !== this.faction) {
        throw new Error(`Invalid faction for card ${card.name}`);
      }
    });
  }

  private validateDeckCardTypes(): void {
    this._cards.forEach((card) => {
      if (card.type === CardType.LEADER) {
        throw new Error("Leader card cannot be in the deck");
      }
    });
  }

  private validateNoDuplicateCards(): void {
    const cardIds = this._cards.map((card) => card.id);
    const uniqueCardIds = new Set(cardIds);

    if (cardIds.length !== uniqueCardIds.size) {
      throw new Error("Deck cannot contain duplicate cards");
    }
  }

  private validateNoHiddenCards(): void {
    this._cards.forEach((card) => {
      if (card.isHiddenCard) {
        throw new Error("Deck cannot contain hidden cards");
      }
    });
  }

  validate(): Error | true {
    try {
      this.validateLeader();
      this.validateDeckSize();
      this.validateNoHiddenCards();
      this.validateDeckCardTypes();
      this.validateDeckFaction();
      this.validateNoDuplicateCards();
      return true;
    } catch (error: unknown) {
      return error instanceof Error ? error : new Error(String(error));
    }
  }
}
