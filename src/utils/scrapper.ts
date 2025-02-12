import { writeFileSync } from "fs";
import { launch } from "puppeteer";
import { BoardRowType, Card, CardType, Faction, SpecialAbility } from "./types";

const BASE_URL = "https://witcher.fandom.com";
const GENERAL_URL = `${BASE_URL}/wiki/Gwent`;

/*
TODO:
[x] Extract semanticId and flavourText
[x] Add isHiddenCard property for cards that only appears when other cards dies
[x] Add multiple cards with the same name
[x] Bug: some cards are not coming with semanticId
[x] Bug: the very first card of each faction is empty
[x] Some cards got the special abilities wrong (specially leaders)
[x] allowedRows is not working
[x] ids are restarting at every faction
[x] some special abilities are uppercase, as if they were only the keys of the type
[ ] verify abilities with ***
[ ] improve logging
*/

function msToS(ms: number) {
  return (ms / 1000).toFixed(3);
}

function logNavigate(url: string) {
  console.log(`🌐 Navigating to "${url}"`);
}

function extractAllowedRows(rowTitle: string): BoardRowType[] {
  if (!rowTitle) return [];

  rowTitle = rowTitle.toLowerCase();

  const allowedRows: BoardRowType[] = [];

  if (rowTitle.includes("agile"))
    allowedRows.push(BoardRowType.MELEE, BoardRowType.RANGED);
  if (rowTitle.includes("close")) allowedRows.push(BoardRowType.MELEE);
  if (rowTitle.includes("ranged")) allowedRows.push(BoardRowType.RANGED);
  if (rowTitle.includes("siege")) allowedRows.push(BoardRowType.SIEGE);

  return allowedRows;
}

function extractSpecialAbilities(
  specialAbilitiesText: string,
  cardName: string,
  cardType: CardType,
): (SpecialAbility | string)[] {
  if (!specialAbilitiesText) return [];
  if (cardType === CardType.LEADER) return [];
  if (cardType === CardType.WEATHER) {
    if (cardName.toLowerCase() === "clear weather")
      return [SpecialAbility.CLEAR_WEATHER];
    return [SpecialAbility.WEATHER];
  }
  if (cardName.toLowerCase() === "commander's horn")
    return [SpecialAbility.HORN];
  if (cardName.toLowerCase() === "decoy") return [SpecialAbility.DECOY];

  const specialAbilities =
    specialAbilitiesText?.split("\n")?.map((abilityText) => {
      if (abilityText.includes("When this card is removed"))
        return SpecialAbility.SUMMON_AVENGER;

      let finalText =
        abilityText
          ?.split(":")?.[0]
          ?.trim()
          ?.toUpperCase()
          ?.replaceAll(" ", "_")
          ?.replaceAll("'", "") || "";

      if (finalText.includes("HORN")) finalText = "HORN";
      if (finalText.includes("SCORCH")) finalText = "SCORCH";

      return (
        SpecialAbility[finalText as keyof typeof SpecialAbility] ||
        `***${finalText}`
        // if it has ***, it means that it is not present in the type
      );
    }) || [];

  return specialAbilities;
}

async function scrapeGwentCards() {
  const globalTimeStart = Date.now();

  const browser = await launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(GENERAL_URL, { waitUntil: "domcontentloaded" });
  logNavigate(GENERAL_URL);

  const factionLinksTimeStart = Date.now();
  // extract the links containing each factions' cards
  const factionLinks = await page.evaluate(() => {
    const rows = document.querySelectorAll(".fandom-table tbody tr");
    return Array.from(rows).map((row) => {
      const linkElement = row.querySelector("td > a") as HTMLAnchorElement;
      return {
        factionLink: linkElement ? linkElement.href : "",
        factionName: (
          row.querySelector("td:nth-child(2) > a") as HTMLElement
        )?.innerText
          .toUpperCase()
          .replaceAll("GWENT DECK", "")
          .trim()
          .replaceAll(" ", "_")
          .replaceAll("'", "")
          .replaceAll("GWENT_", "")
          .replaceAll("_CARDS", ""),
      };
    });
  });

  console.log(
    `✅ Faction links extracted (${msToS(Date.now() - factionLinksTimeStart)}s)`,
    factionLinks,
  );

  const finalCards: Omit<Card, "calculatedStrength">[] = [];

  for (const { factionLink, factionName } of factionLinks) {
    const factionPage = await browser.newPage();
    await factionPage.goto(factionLink, {
      waitUntil: "domcontentloaded",
    });
    logNavigate(factionLink);

    const factionCardsRaw: (Record<
      keyof Omit<
        Card,
        "calculatedStrength" | "faction" | "id" | "isHiddenCard"
      >,
      string
    > & { cardLink: string; repetitions: number })[] =
      await factionPage.evaluate(async () => {
        const rows = document.querySelectorAll(".fandom-table tbody tr");

        const factionCardsRaw = Array.from(rows)
          .slice(1)
          .flatMap((row) => {
            const name = (
              row.querySelector("td:nth-child(2) > a") as HTMLElement
            )?.innerText;
            const type = (row.querySelector("td:nth-child(3)") as HTMLElement)
              ?.innerText;
            const baseStrength = (
              row.querySelector("td:nth-child(5)") as HTMLElement
            )?.innerText;

            const allowedRows = (
              row.querySelector("td:nth-child(4) > a") as HTMLElement
            )?.title;

            const specialAbilities = (
              row.querySelector("td:nth-child(6)") as HTMLElement
            )?.innerText;

            const repetitions =
              (row.querySelector("td:nth-child(7)") as HTMLElement)?.innerText
                .split("\n")
                .reduce((acc: number, curr: string) => {
                  const number = curr.match(/\d/)?.[0];
                  if (number) return acc + Number(number);

                  return acc + 1;
                }, 0) || 1;

            const cardLink =
              (row.querySelector("td:nth-child(2) > a") as HTMLAnchorElement)
                ?.href || "";

            return new Array(repetitions).fill(null).map(() => ({
              name,
              baseStrength,
              type,
              allowedRows,
              specialAbilities,
              flavourText: "",
              semanticId: "",
              cardLink,
              repetitions,
            }));
          });

        return factionCardsRaw;
      });

    await factionPage.close();

    let counter = 0;

    const cardLinkDataCache: Record<string, [string, string]> = {};

    const finalFactionCards: Omit<Card, "calculatedStrength">[] =
      await Promise.all(
        factionCardsRaw.map(async ({ cardLink, ...rawCard }) => {
          let flavourText = "";
          let semanticId = "";
          if (cardLink) {
            const cardPage = await browser.newPage();
            await cardPage.goto(`${cardLink}`, {
              waitUntil: "domcontentloaded",
            });
            if (rawCard.repetitions > 1 && cardLinkDataCache?.[rawCard.name]) {
              console.log("USED LINK CACHE");

              [flavourText, semanticId] = cardLinkDataCache[rawCard.name];
            } else {
              logNavigate(cardLink);

              [flavourText, semanticId] = await cardPage.evaluate(() => {
                const flavourText = (
                  document.querySelector(".pi-caption") as HTMLElement
                )?.innerText;
                const semanticId =
                  document
                    .querySelector(
                      "#mw-content-text > div > aside > section:last-child > section > section > div",
                    )
                    ?.innerHTML.split("<br>")[0] || "";

                return [flavourText, semanticId];
              });

              if (rawCard.repetitions > 1)
                cardLinkDataCache[rawCard.name] = [flavourText, semanticId];

              await cardPage.close();
            }
          }

          console.log(`☑️ Extracted card '${rawCard.name}' ('${semanticId}')`);

          return {
            id: counter++,
            name: rawCard.name,
            baseStrength: parseInt(rawCard.baseStrength, 10) || 0,
            faction: Faction[factionName.toUpperCase() as keyof typeof Faction],
            type: CardType[rawCard.type.toUpperCase() as keyof typeof CardType],
            allowedRows: extractAllowedRows(rawCard.allowedRows),
            specialAbilities: extractSpecialAbilities(
              rawCard.specialAbilities,
              rawCard.name,
              CardType[rawCard.type.toUpperCase() as keyof typeof CardType],
            ),
            flavourText: flavourText,
            semanticId: semanticId,
            ...(!semanticId
              ? {
                  isHiddenCard: true,
                }
              : {}),
          };
        }),
      );

    finalCards.push(...finalFactionCards);

    console.log(`✅ Extracted cards from faction ${factionName}`);
  }

  await browser.close();

  const output = `export const Cards: Omit<Card, "calculatedStrength">[] = ${JSON.stringify(finalCards, null, 2)};`;
  const filename = "GENERATED_cards.ts";
  writeFileSync(filename, output, "utf8");

  console.log(
    `✅ File '${filename}' successfully generated! (Total time: ${msToS(Date.now() - globalTimeStart)}s)`,
  );
}

scrapeGwentCards();
