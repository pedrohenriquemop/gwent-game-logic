import { BoardRow, Card, CardType, Faction } from "./types";

export const Cards: Card[]  = [
    {
        id: 0,
        name: "Geralt of Rivia",
        flavourText: "If that's what it takes to save the world, it'd better to let that world die.",
        baseStrength: 15,
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        allowedRows: [BoardRow.MELEE],
    },
    {
        id: 1,
        name: "Cirilla Fiona Elen Riannon",
        flavourText: "Know when fairy tales cease to be tales? When people start believing in them.",
        baseStrength: 15,
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        allowedRows: [BoardRow.MELEE],
    },
    {
        id: 2,
        name: "Triss Merigold",
        flavourText: "I can take care of myself. Trust me.",
        baseStrength: 7,
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        allowedRows: [BoardRow.MELEE],
    },
    {
        id: 3,
        name: "Yennefer of Vengerberg",
        flavourText: "Magic is Chaos, Art and Science. It is a curse, a blessing and a progression.",
        baseStrength: 7,
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        allowedRows: [BoardRow.RANGED],
        specialAbilities: ['Medic'],
    },
]