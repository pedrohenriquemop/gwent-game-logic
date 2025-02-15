import { CardsReference } from "../../utils/cards_reference";
import { CardInterface, CardType, RowEffect } from "../../utils/types";

export default class Card implements CardInterface {
  readonly id;
  readonly semanticId;
  readonly name;
  readonly flavourText;
  readonly baseStrength;
  readonly faction;
  readonly allowedRows;
  readonly specialAbilities;
  readonly type;
  readonly isHiddenCard: boolean | undefined;

  calculatedStrength: number;

  constructor(_card: CardInterface | number) {
    const card = typeof _card === "number" ? CardsReference[_card] : _card;

    this.id = card.id;
    this.semanticId = card.semanticId;
    this.name = card.name;
    this.flavourText = card.flavourText;
    this.baseStrength = card.baseStrength;
    this.faction = card.faction;
    this.allowedRows = card.allowedRows;
    this.specialAbilities = card.specialAbilities;
    this.type = card.type;
    this.isHiddenCard = card.isHiddenCard;

    this.calculatedStrength = card.baseStrength;
  }

  calculateStrength(effects: RowEffect[]): number {
    if (this.type !== CardType.UNIT) {
      throw new Error("Cannot calculate strength of a non-unit card");
    }

    let newStrength = this.baseStrength;

    // TODO: evaluate correct order of effects
    if (effects.includes(RowEffect.WEATHER)) {
      newStrength = 1;
    }
    if (effects.includes(RowEffect.TIGHT_BOND)) {
      newStrength +=
        newStrength *
        effects.reduce(
          (acc, curr) => (curr === RowEffect.TIGHT_BOND ? acc + 1 : acc),
          0,
        );
    }
    if (effects.includes(RowEffect.HORN)) {
      newStrength *= 2;
    }
    if (effects.includes(RowEffect.MORALE_BOOST)) {
      newStrength += 1;
    }

    this.calculatedStrength = newStrength;

    return newStrength;
  }
}
