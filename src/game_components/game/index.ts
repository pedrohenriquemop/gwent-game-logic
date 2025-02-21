import { PassAction, PlayerAction, SelectCardFromSetAction } from "../action";
import Player from "../player";
import Spectator from "../spectator";

export default class Game {
  private players: [Player, Player];
  private currentPlayer: number; // 0 (player1) or 1 (player2)
  private spectators: Spectator[];
  private startTime: Date;
  private status: "waiting" | "processing" | "finished";
  private currentActionHandler: (action: PlayerAction) => void; // this will be a function that will handle the current action
  private expectedActions: PlayerAction[];

  setResolvedAction(action: PlayerAction) {
    if (!this.expectedActions?.length) {
      throw new Error("No actions expected");
    }

    if (!this.currentActionHandler) {
      throw new Error("No action handler set");
    }

    if (!action.isResolved()) {
      throw new Error("Action is not resolved");
    }

    this.removeExpectedAction(action);

    this.currentActionHandler(action);
  }

  private removeExpectedAction(action: PlayerAction) {
    const expectedActionIndex = this.expectedActions.findIndex(
      (expectedAction) =>
        expectedAction.name === action.name &&
        expectedAction.agent === action.agent,
    );

    if (expectedActionIndex === -1) {
      throw new Error("Unexpected action");
    }

    this.expectedActions.splice(expectedActionIndex, 1);
  }

  private setExpectedActions(
    actions: PlayerAction[],
    actionHandler: (action: PlayerAction) => void,
  ) {
    this.expectedActions = actions;
    this.currentActionHandler = actionHandler;
  }

  startGame(player1: Player, player2: Player, spectators?: Spectator[]) {
    this.players = [player1, player2];
    this.currentPlayer = 0;
    this.spectators = spectators || [];
    this.startTime = new Date();

    this.dealFirstHandOfCards();
  }

  private dealFirstHandOfCards() {
    // this should select 10 random cards for each player
    this.players.forEach((player) => {
      player.pickCardsFromDeck(10);
      // this.expectedActions.push(
      //   new SelectCardFromSetAction(player.getRole(), player.getHand()),
      //   new SelectCardFromSetAction(player.getRole(), player.getHand()),
      //   new PassAction(player.getRole()),
      // );
    });
    // then, it should await for both players to select at most 2 cards to mulligan
    //   for that, it should notify the players that they can mulligan
    //   the game status will be "waiting" until both players have selected their mulligan cards
    // then, it should deal the remaining cards to the players
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
