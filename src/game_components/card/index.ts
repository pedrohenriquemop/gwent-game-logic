import { BoardRow, CardType, Faction } from "../../utils/types";

export default class Card {
  private id: number;
  private name: string;
  private flavorText: string;
  private baseStrength: number;
  private faction: Faction;
  private allowedRows: BoardRow[];
  private specialAbility: string;
  private type: CardType;

  private resultingStrength: number;

  constructor(
    id: number,
    name: string,
    flavorText: string,
    baseStrength: number,
    faction: Faction,
    allowedRows: BoardRow[],
    specialAbility: string,
    type: CardType,
  ) {
    this.id = id;
    this.name = name;
    this.flavorText = flavorText;
    this.baseStrength = baseStrength;
    this.faction = faction;
    this.allowedRows = allowedRows;
    this.specialAbility = specialAbility;
    this.type = type;

    this.resultingStrength = baseStrength;
  }

  public getType(): CardType {
    return this.type;
  }

  public getName(): string {
    return this.name;
  }

  public getBaseStrength(): number {
    return this.baseStrength;
  }

  public getFaction(): Faction {
    return this.faction;
  }
}
