import Deck from "..";
import { Faction } from "../../../utils/types";

import {
  invalidMonsterDeckCardsWithDuplicate,
  invalidMonsterDeckCardsWithExceedingSpecialCards,
  invalidMonsterDeckCardsWithHiddenCard,
  invalidMonsterDeckCardsWithInvalidFaction,
  invalidMonsterDeckCardsWithLeader,
  invalidMonsterDeckCardsWithNotEnoughUnitCards,
  invalidMonsterLeader,
  validMonsterDeckCards,
  validMonsterLeader,
} from "./mocks/deck.mock";

describe("Deck methods", () => {
  const deck = new Deck(
    validMonsterDeckCards,
    Faction.MONSTERS,
    validMonsterLeader,
  );

  test("getTotalNumberOfCards", () => {
    expect(deck.getTotalNumberOfCards()).toBe(31);
  });
  test("getNumberOfUnitCards", () => {
    expect(deck.getNumberOfUnitCards()).toBe(26);
  });
  test("getNumberOfSpecialCards", () => {
    expect(deck.getNumberOfSpecialCards()).toBe(5);
  });
  test("getnumberOfHeroCards", () => {
    expect(deck.getnumberOfHeroCards()).toBe(4);
  });
  test("getTotalCardStrength", () => {
    expect(deck.getTotalCardStrength()).toBe(134);
  });
  test("sampleFromDeck (with removeSampled = true)", () => {
    const SAMPLE_AMOUNT = 5;

    const initialNumberOfCards = deck.getTotalNumberOfCards();
    const sampledElements = deck.sample(SAMPLE_AMOUNT, true);

    expect(sampledElements).toHaveLength(SAMPLE_AMOUNT);
    expect(deck.getTotalNumberOfCards()).toBe(
      initialNumberOfCards - SAMPLE_AMOUNT,
    );
  });
});

describe("Deck validations", () => {
  test("Valid deck", () => {
    const deck = new Deck(
      validMonsterDeckCards,
      Faction.MONSTERS,
      validMonsterLeader,
    );
    expect(deck.validate()).toBe(true);
  });
  test("Invalid leader", () => {
    const deck = new Deck(
      validMonsterDeckCards,
      Faction.MONSTERS,
      invalidMonsterLeader,
    );
    expect(deck.validate()).toBeInstanceOf(Error);
  });
  test("Invalid deck (duplicate)", () => {
    const deck = new Deck(
      invalidMonsterDeckCardsWithDuplicate,
      Faction.MONSTERS,
      validMonsterLeader,
    );
    expect(deck.validate()).toBeInstanceOf(Error);
  });
  test("Invalid deck (exceeding special cards number)", () => {
    const deck = new Deck(
      invalidMonsterDeckCardsWithExceedingSpecialCards,
      Faction.MONSTERS,
      validMonsterLeader,
    );
    expect(deck.validate()).toBeInstanceOf(Error);
  });
  test("Invalid deck (hidden card)", () => {
    const deck = new Deck(
      invalidMonsterDeckCardsWithHiddenCard,
      Faction.MONSTERS,
      validMonsterLeader,
    );
    expect(deck.validate()).toBeInstanceOf(Error);
  });
  test("Invalid deck (invalid faction)", () => {
    const deck = new Deck(
      invalidMonsterDeckCardsWithInvalidFaction,
      Faction.MONSTERS,
      validMonsterLeader,
    );
    expect(deck.validate()).toBeInstanceOf(Error);
  });
  test("Invalid deck (leader among the cards)", () => {
    const deck = new Deck(
      invalidMonsterDeckCardsWithLeader,
      Faction.MONSTERS,
      validMonsterLeader,
    );
    expect(deck.validate()).toBeInstanceOf(Error);
  });
  test("Invalid deck (not enough unit cards)", () => {
    const deck = new Deck(
      invalidMonsterDeckCardsWithNotEnoughUnitCards,
      Faction.MONSTERS,
      validMonsterLeader,
    );
    expect(deck.validate()).toBeInstanceOf(Error);
  });
});
