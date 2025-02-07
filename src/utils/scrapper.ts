import { writeFileSync } from "fs";
import { launch } from "puppeteer";
import { BoardRowType, Card } from "./types";

const BASE_URL = "https://witcher.fandom.com";
const GENERAL_URL = `${BASE_URL}/wiki/Gwent`;

const titleToAllowedRows: Record<string, BoardRowType[]> = {
  "Gwent agile cards": [BoardRowType.MELEE, BoardRowType.RANGED],
  "Gwent close combat cards": [BoardRowType.MELEE],
  "Gwent ranged combat cards": [BoardRowType.RANGED],
  "Gwent siege cards": [BoardRowType.SIEGE],
};

/*
TODO:
[ ] Extract semanticId and flavourText
[ ] Add isHiddenCard property for cards that only appears when other cards dies
[ ] Add multiple cards with the same name
[ ] Some cards got the special abilities wrong (specially leaders)
[ ] allowedRows is not working
*/

async function scrapeGwentCards() {
  const browser = await launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(GENERAL_URL, { waitUntil: "domcontentloaded" });

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

  console.log("✅ Faction links extracted", factionLinks);

  let cards: Omit<Card, "calculatedStrength">[] = [];

  for (const { factionLink, factionName } of factionLinks) {
    const factionPage = await browser.newPage();
    await factionPage.goto(factionLink, {
      waitUntil: "domcontentloaded",
    });

    const factionCards: Omit<Card, "calculatedStrength" | "id">[] =
      await factionPage.evaluate(
        ({ factionName, titleToAllowedRows }) => {
          const rows = document.querySelectorAll(".fandom-table tbody tr");
          return Promise.all(
            Array.from(rows).map(async (row) => {
              const name = row.querySelector("td:nth-child(2) > a")?.innerText;
              const type = row
                .querySelector("td:nth-child(3)")
                ?.innerText.toUpperCase();
              const baseStrength =
                parseInt(row.querySelector("td:nth-child(5)")?.innerText, 10) ||
                0;
              const faction = factionName.toUpperCase();

              const allowedRows =
                titleToAllowedRows[
                  (
                    row.querySelector(
                      "td:nth-child(3) > a",
                    ) as HTMLAnchorElement
                  )?.title
                ] || [];
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

              // const cardLink =
              //   (row.querySelector("td:nth-child(2) > a") as HTMLAnchorElement)
              //     ?.href || "";

              // const cardPage = await browser.newPage();
              // await cardPage.goto(cardLink, {
              //   waitUntil: "domcontentloaded",
              // });

              // const [flavourText, semanticId] = await cardPage.evaluate(() => {
              //   const flavourText =
              //     document.querySelector(".pi-caption")?.innerText;
              //   const semanticId =
              //     document
              //       .querySelector(
              //         "#mw-content-text > div > aside > section:nth-child(7) > section > section > div",
              //       )
              //       ?.innerHTML.split("<br>")[0] || "";

              //   return [flavourText, semanticId];
              // });

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
        },
        { factionName, titleToAllowedRows },
      );

    cards.push(...factionCards);
    await factionPage.close();

    console.log(`✅ Extracted cards from faction ${factionName}`);
  }

  await browser.close();

  cards = cards.map((card, index) => ({
    id: index,
    ...card,
  }));

  const output = `export const Cards: Omit<Card, "calculatedStrength">[] = ${JSON.stringify(cards, null, 2)};`;
  const filename = "GENERATED_cards.ts";
  writeFileSync(filename, output, "utf8");

  console.log(`✅ File '${filename}' successfully generated!`);
}

scrapeGwentCards();
