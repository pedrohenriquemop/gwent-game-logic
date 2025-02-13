import { writeFileSync } from "fs";
import { launch } from "puppeteer";
import { Card, CardType } from "./types";

const BASE_URL = "https://witcher.fandom.com";
const GENERAL_URL = `${BASE_URL}/wiki/Gwent`;

/*
Helper REGEX to clean the result file:
Find: "([type_goes_here]\.\w+)"
Replace: $1

Example:
Find: "(CardType\.\w+)"
Replace: $1
*/

function msToS(ms: number) {
  return (ms / 1000).toFixed(3);
}

function logNavigate(url: string) {
  console.log(`🌐 Navigating to "${url}"`);
}

function extractAllowedRows(rowTitle: string): string[] {
  if (!rowTitle) return [];

  rowTitle = rowTitle.toLowerCase();

  const allowedRows: string[] = [];

  if (rowTitle.includes("agile"))
    allowedRows.push("BoardRowType.MELEE", "BoardRowType.RANGED");
  if (rowTitle.includes("close")) allowedRows.push("BoardRowType.MELEE");
  if (rowTitle.includes("ranged")) allowedRows.push("BoardRowType.RANGED");
  if (rowTitle.includes("siege")) allowedRows.push("BoardRowType.SIEGE");

  return allowedRows;
}

const weatherCardsNames = [
  "Skellige Storm",
  "Biting Frost",
  "Clear Weather",
  "Impenetrable Fog",
  "Torrential Rain",
].map((name) => name.toLowerCase());

function extractSpecialAbilities(
  specialAbilitiesText: string,
  cardName: string,
  cardType: CardType,
): string[] {
  if (!specialAbilitiesText) return [];
  if (cardType === CardType.LEADER) return [];
  if (weatherCardsNames.includes(cardName.toLowerCase())) {
    if (cardName.toLowerCase() === "clear weather")
      return ["SpecialAbility.CLEAR_WEATHER"];
    return ["SpecialAbility.WEATHER"];
  }
  if (cardName.toLowerCase() === "commander's horn")
    return ["SpecialAbility.HORN"];
  if (cardName.toLowerCase() === "decoy") return ["SpecialAbility.DECOY"];
  if (cardName.toLowerCase() === "mardroeme")
    return ["SpecialAbility.MARDROEME"];

  const specialAbilities =
    specialAbilitiesText?.split("\n")?.map((abilityText) => {
      if (abilityText.toLowerCase().includes("when this card is removed"))
        return "SpecialAbility.SUMMON_AVENGER";

      if (
        abilityText
          .toLowerCase()
          .includes(
            "transforms into a bear when a mardroeme card is on its row",
          )
      )
        return "SpecialAbility.BERSERK";

      let finalText =
        abilityText
          ?.split(":")?.[0]
          ?.trim()
          ?.toUpperCase()
          ?.replaceAll(" ", "_")
          ?.replaceAll("'", "") || "";

      if (finalText.includes("HORN")) finalText = "HORN";
      if (finalText.includes("SCORCH")) finalText = "SCORCH";
      if (finalText.includes("SUMMON_SHIELD_MAIDENS")) finalText = "MUSTER";

      return `SpecialAbility.${finalText}`;
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

  type MutableCard = {
    -readonly [K in keyof Card]: Card[K];
  };

  const finalCards: Omit<MutableCard, "calculatedStrength">[] = [];

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

    const cardLinkDataCache: Record<string, [string, string]> = {};

    const finalFactionCards: Omit<Card, "calculatedStrength">[] =
      await Promise.all(
        factionCardsRaw
          // this filter avoids Skellige Storm duplicates in neutral and skellige deck cards (it is a neutral card)
          .filter(
            (rawCard) =>
              rawCard.name.toLowerCase() !== "skellige storm" ||
              factionName.toUpperCase() !== "SKELLIGE",
          )
          .map(async ({ cardLink, ...rawCard }) => {
            let flavourText = "";
            let semanticId = "";
            if (cardLink) {
              const cardPage = await browser.newPage();
              await cardPage.goto(`${cardLink}`, {
                waitUntil: "domcontentloaded",
              });
              if (
                rawCard.repetitions > 1 &&
                cardLinkDataCache?.[rawCard.name]
              ) {
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

            console.log(
              `☑️ Extracted card '${rawCard.name}' ('${semanticId}')`,
            );

            let cardType = rawCard.type.toUpperCase();

            if (cardType === "HERO") cardType = "UNIT";
            if (cardType === "WEATHER") cardType = "SPECIAL";

            return {
              id: -1,
              name: rawCard.name,
              baseStrength: parseInt(rawCard.baseStrength, 10) || 0,
              faction: `Faction.${factionName.toUpperCase()}`,
              type: `CardType.${cardType}`,
              allowedRows: extractAllowedRows(rawCard.allowedRows),
              specialAbilities: extractSpecialAbilities(
                rawCard.specialAbilities,
                rawCard.name,
                CardType[cardType as keyof typeof CardType],
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

  for (let i = 0; i < finalCards.length; i++) {
    finalCards[i].id = i;
  }

  const output = `export const Cards: Omit<Card, "calculatedStrength">[] = ${JSON.stringify(finalCards, null, 2)};`;
  const filename = "GENERATED_cards.ts";
  writeFileSync(filename, output, "utf8");

  console.log(
    `✅ File '${filename}' successfully generated! (Total time: ${msToS(Date.now() - globalTimeStart)}s)`,
  );
}

scrapeGwentCards();
