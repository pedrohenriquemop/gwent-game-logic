import {
  BoardRowType,
  RowEffect,
  UniqueRowEffect,
  WeatherEffect,
} from "../../utils/types";
import Card from "../card";

type BoardRow = {
  cards: Card[];
  totalStrength: number;
  hasWeatherEffect: boolean;
  uniqueEffect: UniqueRowEffect | null;
  rowEffects: RowEffect[] | null;
};

type BoardSide = {
  [key in BoardRowType]: BoardRow;
};

export default class Board {
  readonly sides: [BoardSide, BoardSide];

  constructor() {
    this.sides = [
      {
        [BoardRowType.MELEE]: {
          cards: [],
          totalStrength: 0,
          hasWeatherEffect: false,
          uniqueEffect: null,
          rowEffects: null,
        },
        [BoardRowType.RANGED]: {
          cards: [],
          totalStrength: 0,
          hasWeatherEffect: false,
          uniqueEffect: null,
          rowEffects: null,
        },
        [BoardRowType.SIEGE]: {
          cards: [],
          totalStrength: 0,
          hasWeatherEffect: false,
          uniqueEffect: null,
          rowEffects: null,
        },
      },
      {
        [BoardRowType.MELEE]: {
          cards: [],
          totalStrength: 0,
          hasWeatherEffect: false,
          uniqueEffect: null,
          rowEffects: null,
        },
        [BoardRowType.RANGED]: {
          cards: [],
          totalStrength: 0,
          hasWeatherEffect: false,
          uniqueEffect: null,
          rowEffects: null,
        },
        [BoardRowType.SIEGE]: {
          cards: [],
          totalStrength: 0,
          hasWeatherEffect: false,
          uniqueEffect: null,
          rowEffects: null,
        },
      },
    ];
  }

  setWeatherEffect(effect: WeatherEffect) {
    switch (effect) {
      case WeatherEffect.FROST:
        this.sides.forEach((side, sideIndex) => {
          side[BoardRowType.MELEE].hasWeatherEffect = true;

          this.updateRowCardsStrength(sideIndex, BoardRowType.MELEE);
        });
        break;
      case WeatherEffect.FOG:
        this.sides.forEach((side, sideIndex) => {
          side[BoardRowType.RANGED].hasWeatherEffect = true;

          this.updateRowCardsStrength(sideIndex, BoardRowType.RANGED);
        });
        break;
      case WeatherEffect.RAIN:
        this.sides.forEach((side, sideIndex) => {
          side[BoardRowType.SIEGE].hasWeatherEffect = true;

          this.updateRowCardsStrength(sideIndex, BoardRowType.SIEGE);
        });
        break;
      case WeatherEffect.CLEAR:
        this.sides.forEach((side, sideIndex) => {
          Object.keys(side).forEach((rowType) => {
            const row = side[rowType as BoardRowType];
            row.hasWeatherEffect = false;

            this.updateRowCardsStrength(sideIndex, rowType as BoardRowType);
          });
        });
        break;
    }
  }

  setUniqueEffect(
    effect: UniqueRowEffect | null,
    side: number,
    row: BoardRowType,
  ) {
    if (!effect) {
      this.removeUniqueEffect(side, row);
      return;
    }

    this.sides[side][row].uniqueEffect = effect;

    this.updateRowCardsStrength(side, row);
  }

  removeUniqueEffect(side: number, row: BoardRowType) {
    this.sides[side][row].uniqueEffect = null;

    this.updateRowCardsStrength(side, row);
  }

  addCards(cards: Card[], side: number, row: BoardRowType) {
    const boardRow = this.sides[side][row];

    // TODO: check if card can be played in this row (no duplicates, etc.)
    boardRow.cards.push(...cards);

    this.updateRowCardsStrength(side, row);
  }

  updateRowCardsStrength(side: number, row: BoardRowType) {
    const boardRow = this.sides[side][row];

    let totalRowStrength = 0;

    boardRow.cards.forEach((card) => {
      const effects: RowEffect[] = [];
      if (boardRow.hasWeatherEffect) effects.push(RowEffect.WEATHER);
      if (boardRow.uniqueEffect) {
        if (boardRow.uniqueEffect === UniqueRowEffect.HORN)
          effects.push(RowEffect.HORN);
        if (boardRow.uniqueEffect === UniqueRowEffect.MARDROEME)
          effects.push(RowEffect.MARDROEME);
      }

      const newStrength = card.calculateStrength(effects);
      totalRowStrength += newStrength;
    });

    boardRow.totalStrength = totalRowStrength;
  }

  calculateTotalSideStrength(side: number) {
    let totalStrength = 0;
    Object.values(BoardRowType).forEach((rowType) => {
      totalStrength += this.sides[side][rowType].totalStrength;
    });
    return totalStrength;
  }
}
