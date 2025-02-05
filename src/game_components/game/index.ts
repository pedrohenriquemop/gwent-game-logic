import { Card } from "../../utils/types";
import Player from "../player";

type PlayerInfo = {
  player: Player;
  totalStrength: number;
  lifes: number;
  hasPassed: boolean;
  isLeaderPowerAvailable: boolean;
  cardsInDeck: Card[];
  cardsInHand: Card[];
  cardsInGraveyard: Card[];
};

export default class Game {
  private playerInfos: [PlayerInfo, PlayerInfo];
  private currentPlayer: PlayerInfo;
  private spectators: Player[];
  private startTime: Date;

  startGame() {
    console.log("TODO: start game");
  }

  dealCards() {
    console.log("TODO: deal cards");
  }

  startRound() {
    console.log("TODO: start round");
  }

  endRound() {
    console.log("TODO: end round");
  }

  startPlayerTurn() {
    console.log("TODO: start player turn");
  }
}
