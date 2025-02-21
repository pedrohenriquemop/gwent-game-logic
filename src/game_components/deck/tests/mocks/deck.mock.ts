import Card from "../../../card";

export const validMonsterLeader = 13;
export const invalidMonsterLeader = 12;

export const validMonsterDeckCards = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 227, 228, 229, 242, 243, 250, 231, 266,
].map((cardId) => new Card(cardId));

export const invalidMonsterDeckCardsWithLeader = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 18, 19, 20, 21, 22, 23, 24, 25,
  26, 27, 227, 228, 229, 242, 243, 250, 231, 266,
].map((cardId) => new Card(cardId));

export const invalidMonsterDeckCardsWithNotEnoughUnitCards = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22, 227, 228, 229,
  242, 243, 250, 231, 266,
].map((cardId) => new Card(cardId));

export const invalidMonsterDeckCardsWithExceedingSpecialCards = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 227, 228, 229, 233, 234, 235, 236, 237, 238, 239, 242, 243, 244, 250, 231,
  266,
].map((cardId) => new Card(cardId));

export const invalidMonsterDeckCardsWithInvalidFaction = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 48, 227, 228, 229, 242, 243, 250, 231, 266,
].map((cardId) => new Card(cardId));

export const invalidMonsterDeckCardsWithDuplicate = [
  0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22, 23, 24, 25,
  26, 27, 227, 228, 229, 242, 243, 250, 231, 266,
].map((cardId) => new Card(cardId));

export const invalidMonsterDeckCardsWithHiddenCard = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 203, 227, 228, 229, 242, 243, 250, 231, 266,
].map((cardId) => new Card(cardId));
