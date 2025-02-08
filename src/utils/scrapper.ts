import { writeFileSync } from "fs";
import { launch } from "puppeteer";
import { BoardRowType, Card } from "./types";

const BASE_URL = "https://witcher.fandom.com";
const GENERAL_URL = `${BASE_URL}/wiki/Gwent`;

/*
TODO:
[x] Extract semanticId and flavourText
[ ] Add isHiddenCard property for cards that only appears when other cards dies
[ ] Add multiple cards with the same name
[ ] Some cards got the special abilities wrong (specially leaders)
[x] allowedRows is not working
[ ] improve logging
*/

function msToS(ms: number) {
  return (ms / 1000).toFixed(3);
}

async function scrapeGwentCards() {
  const globalTimeStart = Date.now();

  const browser = await launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(GENERAL_URL, { waitUntil: "domcontentloaded" });

  const factionLinksTimeStart = Date.now();
  // extract the links containing each factions' cards
  const factionLinks = await page.evaluate(() => {
    const rows = document.querySelectorAll(".fandom-table tbody tr");
    return Array.from(rows).map((row) => {
      const linkElement = row.querySelector("td > a") as HTMLAnchorElement;
      return {
        factionLink: linkElement ? linkElement.href : "",
        factionName: row
          .querySelector("td:nth-child(2) > a")
          ?.innerText.toUpperCase()
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

  const cards: Omit<Card, "calculatedStrength" | "id">[] = [];

  for (const { factionLink, factionName } of factionLinks) {
    const factionPage = await browser.newPage();
    await factionPage.goto(factionLink, {
      waitUntil: "domcontentloaded",
    });

    const [factionCards, cardLinks]: [
      Omit<Card, "calculatedStrength" | "id">[],
      string[],
    ] = await factionPage.evaluate(
      async ({ factionName, BoardRowType }) => {
        const rows = document.querySelectorAll(".fandom-table tbody tr");
        const cardLinks: string[] = [];
        const factionCards = await Promise.all(
          Array.from(rows).map(async (row) => {
            const name = row.querySelector("td:nth-child(2) > a")?.innerText;
            const type = row
              .querySelector("td:nth-child(3)")
              ?.innerText.toUpperCase();
            const baseStrength =
              parseInt(row.querySelector("td:nth-child(5)")?.innerText, 10) ||
              0;
            const faction = factionName.toUpperCase();

            const allowedRows = [];
            const rowTitle =
              (
                row.querySelector("td:nth-child(4) > a") as HTMLAnchorElement
              )?.title?.toLowerCase() || "";

            if (rowTitle.includes("agile"))
              allowedRows.push(BoardRowType.MELEE, BoardRowType.RANGED);
            if (rowTitle.includes("close"))
              allowedRows.push(BoardRowType.MELEE);
            if (rowTitle.includes("ranged"))
              allowedRows.push(BoardRowType.RANGED);
            if (rowTitle.includes("siege"))
              allowedRows.push(BoardRowType.SIEGE);

            const specialAbilitiesText =
              row
                .querySelector("td:nth-child(6)")
                ?.innerText?.split(":")?.[0]
                ?.trim()
                ?.toUpperCase()
                ?.replaceAll(" ", "_") || "";
            const specialAbilities =
              specialAbilitiesText && specialAbilitiesText !== "HERO"
                ? [specialAbilitiesText]
                : [];

            const cardLink =
              (row.querySelector("td:nth-child(2) > a") as HTMLAnchorElement)
                ?.href || "";
            cardLinks.push(cardLink);

            return {
              name,
              baseStrength,
              faction,
              type,
              allowedRows,
              specialAbilities,
              flavourText: "TODO",
              semanticId: "TODO",
            };
          }),
        );

        return [factionCards, cardLinks] as [
          Omit<Card, "calculatedStrength">[],
          string[],
        ];
      },
      { factionName, BoardRowType },
    );

    for (const [index, cardLink] of cardLinks.entries()) {
      if (!cardLink) continue;

      const cardPage = await browser.newPage();
      await cardPage.goto(`${cardLink}`, {
        waitUntil: "domcontentloaded",
      });

      const [flavourText, semanticId] = await cardPage.evaluate(() => {
        const flavourText = document.querySelector(".pi-caption")?.innerText;
        const semanticId =
          document
            .querySelector(
              "#mw-content-text > div > aside > section:nth-child(7) > section > section > div",
            )
            ?.innerHTML.split("<br>")[0] || "";

        return [flavourText, semanticId];
      });

      await cardPage.close();

      factionCards[index] = {
        ...factionCards[index],
        semanticId,
        flavourText,
      };

      console.log(`☑️ Extracted card '${factionCards[index].name}'`);
    }

    cards.push(...factionCards);
    await factionPage.close();

    console.log(`✅ Extracted cards from faction ${factionName}`);
  }

  await browser.close();

  const finalCards: Omit<Card, "calculatedStrength">[] = cards.map(
    (card, index) => ({
      id: index,
      ...card,
    }),
  );

  const output = `export const Cards: Omit<Card, "calculatedStrength">[] = ${JSON.stringify(finalCards, null, 2)};`;
  const filename = "GENERATED_cards.ts";
  writeFileSync(filename, output, "utf8");

  console.log(
    `✅ File '${filename}' successfully generated! (Total time: ${msToS(Date.now() - globalTimeStart)}s)`,
  );
}

scrapeGwentCards();
