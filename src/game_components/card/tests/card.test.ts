import { RowEffect } from "../../../utils/types";
import Card from "..";

describe("Card validations", () => {
  test("Calculate correct strength according to effects", () => {
    const card = new Card(1);

    let calculatedStrength = card.calculateStrength([
      RowEffect.HORN,
      RowEffect.MORALE_BOOST,
      RowEffect.TIGHT_BOND,
    ]);

    expect(calculatedStrength).toBe(card.baseStrength * 2 * 2 + 1);

    calculatedStrength = card.calculateStrength([
      RowEffect.TIGHT_BOND,
      RowEffect.TIGHT_BOND,
      RowEffect.TIGHT_BOND,
    ]);

    expect(calculatedStrength).toBe(card.baseStrength * 4);

    calculatedStrength = card.calculateStrength([
      RowEffect.HORN,
      RowEffect.MORALE_BOOST,
      RowEffect.TIGHT_BOND,
      RowEffect.TIGHT_BOND,
      RowEffect.WEATHER,
    ]);

    expect(calculatedStrength).toBe(1 * 3 * 2 + 1);
  });
});
