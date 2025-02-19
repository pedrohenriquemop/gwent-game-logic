import Player from "../player";
import Spectator from "../spectator";

export default class Game {
  private players: [Player, Player];
  private currentPlayer: number;
  private spectators: Spectator[];
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
