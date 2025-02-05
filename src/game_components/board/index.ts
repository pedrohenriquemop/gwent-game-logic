import {
  BoardRowType,
  Card,
  CardRowEffect,
  UniqueRowEffect,
  WeatherEffect,
} from "../../utils/types";

type BoardRow = {
  cards: Card[];
  totalStrength: number;
  weatherEffect: WeatherEffect | null;
  uniqueEffect: UniqueRowEffect | null;
  cardEffects: CardRowEffect[] | null;
};

type BoardSide = {
  [key in BoardRowType]: BoardRow;
};

export default class Board {
  public readonly sides: [BoardSide, BoardSide];

  constructor() {
    this.sides = [
      {
        [BoardRowType.MELEE]: {
          cards: [],
          totalStrength: 0,
          weatherEffect: null,
          uniqueEffect: null,
          cardEffects: null,
        },
        [BoardRowType.RANGED]: {
          cards: [],
          totalStrength: 0,
          weatherEffect: null,
          uniqueEffect: null,
          cardEffects: null,
        },
        [BoardRowType.SIEGE]: {
          cards: [],
          totalStrength: 0,
          weatherEffect: null,
          uniqueEffect: null,
          cardEffects: null,
        },
      },
      {
        [BoardRowType.MELEE]: {
          cards: [],
          totalStrength: 0,
          weatherEffect: null,
          uniqueEffect: null,
          cardEffects: null,
        },
        [BoardRowType.RANGED]: {
          cards: [],
          totalStrength: 0,
          weatherEffect: null,
          uniqueEffect: null,
          cardEffects: null,
        },
        [BoardRowType.SIEGE]: {
          cards: [],
          totalStrength: 0,
          weatherEffect: null,
          uniqueEffect: null,
          cardEffects: null,
        },
      },
    ];
  }

  public setWeatherEffect(
    effect: WeatherEffect,
    side: number,
    row: BoardRowType,
  ) {
    this.sides[side][row].weatherEffect = effect;
  }

  public setUniqueEffect(
    effect: UniqueRowEffect,
    side: number,
    row: BoardRowType,
  ) {
    this.sides[side][row].uniqueEffect = effect;
  }

  public addCard(card: Card, side: number, row: BoardRowType) {
    const boardRow = this.sides[side][row];
    boardRow.cards.push(card);
    boardRow.totalStrength += card.calculatedStrength;
  }

  public calculateRowTotalStrength(side: number, rowType: BoardRowType) {
    const row = this.sides[side][rowType];
    let totalStrength = 0;
    row.cards.forEach((card) => {
      totalStrength += card.calculatedStrength;
    });
    return totalStrength;
  }

  public calculateTotalStrength(side: number) {
    let totalStrength = 0;
    Object.values(BoardRowType).forEach((rowType) => {
      totalStrength += this.calculateRowTotalStrength(side, rowType);
    });
    return totalStrength;
  }
}
