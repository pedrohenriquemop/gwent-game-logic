import { PlayerRole } from "../../utils/types";
import Card from "../card";
import Deck from "../deck";
import User from "../user";

export default class Player {
  private user: User;
  private role: PlayerRole;
  private deck: Deck;
  private strength: number;
  private lifes: number;
  private hasPassed: boolean;
  private isLeaderPowerAvailable: boolean;
  private hand: Card[];
  private graveyard: Card[];

  constructor(
    user: User,
    role: PlayerRole,
    deck: Deck,
    isLeaderPowerUsable = true,
  ) {
    this.user = user;
    this.role = role;
    this.deck = deck;
    this.strength = 0;
    this.lifes = 2;
    this.hasPassed = false;
    this.isLeaderPowerAvailable = isLeaderPowerUsable;
    this.hand = [];
    this.graveyard = [];
  }

  getRole(): PlayerRole {
    return this.role;
  }

  getStrength(): number {
    return this.strength;
  }

  setStrength(strength: number): void {
    this.strength = strength;
  }

  resetStrength(): void {
    this.strength = 0;
  }

  getLifes(): number {
    return this.lifes;
  }

  loseLife(): number {
    if (this.lifes === 0) {
      throw new Error("Player has no lifes left");
    }

    return --this.lifes;
  }

  getHasPassed(): boolean {
    return this.hasPassed;
  }

  pass(): void {
    if (this.hasPassed) {
      throw new Error("Player has already passed");
    }

    this.hasPassed = true;
  }

  resetHasPassed(): void {
    this.hasPassed = false;
  }

  // setHasPassed(hasPassed: boolean): void {
  //   this.hasPassed = hasPassed;
  // }

  getIsLeaderPowerAvailable(): boolean {
    return this.isLeaderPowerAvailable;
  }

  useLeaderPower(): void {
    if (!this.isLeaderPowerAvailable) {
      throw new Error("Leader power is not available or is not usable");
    }

    this.isLeaderPowerAvailable = false;
  }

  // setIsLeaderPowerAvailable(isLeaderPowerAvailable: boolean): void {
  //   this.isLeaderPowerAvailable = isLeaderPowerAvailable;
  // }

  getHand(): Card[] {
    return this.hand;
  }

  pickCardsFromDeck(amount = 1): void {
    const cards = this.deck.drawCards(amount);
    this.hand.push(...cards);
  }

  // TODO: test this function
  putCardOfHandIntoDeck(card: Card): void {
    const index = this.hand.findIndex((handCard) => handCard.id === card.id);

    if (index === -1) {
      throw new Error("Card is not in hand");
    }

    this.hand.splice(index, 1);
    this.deck.putCardsInDeck([card]);
  }

  playCard(index: number): Card {
    if (index >= this.hand.length) {
      throw new Error("Invalid card index to play");
    }

    return this.hand.splice(index, 1)[0];
  }

  getGraveyard(): Card[] {
    return this.graveyard;
  }

  sendCardsToGraveyard(cards: Card[]): void {
    this.graveyard.push(...cards);
  }

  startRound(): void {
    this.resetStrength();
    this.resetHasPassed();
  }
}
