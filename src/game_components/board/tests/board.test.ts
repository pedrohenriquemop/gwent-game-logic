import Board from "..";
import {
  BoardRowType,
  UniqueRowEffect,
  WeatherEffect,
} from "../../../utils/types";
import Card from "../../card";

describe("Board validations", () => {
  test("Add card and calculate correct strength", () => {
    const board = new Board();
    board.addCards(
      [new Card(1), new Card(2), new Card(3), new Card(4), new Card(5)],
      0,
      BoardRowType.MELEE,
    );

    expect(board.sides[0][BoardRowType.MELEE].totalStrength).toBe(20);

    board.setUniqueEffect(UniqueRowEffect.HORN, 0, BoardRowType.MELEE);

    expect(board.sides[0][BoardRowType.MELEE].totalStrength).toBe(40);

    board.setWeatherEffect(WeatherEffect.FROST);

    expect(board.sides[0][BoardRowType.MELEE].totalStrength).toBe(10);

    board.setUniqueEffect(null, 0, BoardRowType.MELEE);

    expect(board.sides[0][BoardRowType.MELEE].totalStrength).toBe(5);

    board.setWeatherEffect(WeatherEffect.CLEAR);

    expect(board.sides[0][BoardRowType.MELEE].totalStrength).toBe(20);
  });
});
