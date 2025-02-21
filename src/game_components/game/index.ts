import { PlayerRole } from "../../utils/types";
import { PassAction, PlayerAction, SelectCardFromSetAction } from "../action";
import Player from "../player";
import Spectator from "../spectator";

export default class Game {
  private players: [Player, Player];
  private currentPlayer: number; // 0 (player1) or 1 (player2)
  private spectators: Spectator[];
  private startTime: Date | null;
  private status: "waiting" | "ready" | "finished";
  private currentActionHandler: (action: PlayerAction) => void; // this will be a function that will handle the current action
  private expectedActions: PlayerAction[];
  private actionsNotifier: (actions: PlayerAction[]) => void; // this customizable function is called when the game waits for actions

  constructor(player1: Player, player2: Player, spectators?: Spectator[]) {
    this.players = [player1, player2];
    this.currentPlayer = 0;
    this.spectators = spectators || [];
    this.startTime = null;
    this.status = "ready";
    this.currentActionHandler = () => {};
    this.expectedActions = [];
    this.actionsNotifier = (actions) =>
      console.log("Waiting for actions:", actions);
  }

  addResolvedAction(action: PlayerAction) {
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

    if (!this.expectedActions.length) {
      this.status = "ready";
    }
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

  private filterExpectedActions(
    filterFn: (action: PlayerAction) => boolean,
  ): PlayerAction[] {
    return this.expectedActions.filter(filterFn);
  }

  private setExpectedActions(actions: PlayerAction[]) {
    this.expectedActions = actions;
  }

  private setActionHandler(actionHandler: (action: PlayerAction) => void) {
    this.currentActionHandler = actionHandler;
  }

  private waitForActions(
    actions: PlayerAction[],
    actionHandler: (action: PlayerAction) => void,
  ) {
    this.status = "waiting";

    this.setExpectedActions(actions);
    this.setActionHandler(actionHandler);
  }

  private determineFirstPlayer(): number {
    return Math.floor(Math.random() * 2);
  }

  startGame() {
    this.currentPlayer = this.determineFirstPlayer();
    this.startTime = new Date();

    this.dealFirstHandOfCards();
  }

  private dealFirstHandOfCards() {
    const expectedActions: PlayerAction[] = [];

    this.players.forEach((player) => {
      player.pickCardsFromDeck(10);
      expectedActions.push(
        new SelectCardFromSetAction(player.getRole(), player.getHand()),
        new SelectCardFromSetAction(player.getRole(), player.getHand()),
        new PassAction(player.getRole()),
      );
    });

    this.waitForActions(expectedActions, this.firstHandOfCardsActionHandler);
  }

  private selectPlayerByRole(role: PlayerRole): Player {
    const player = this.players.find((player) => player.getRole() === role);
    if (!player) {
      throw new Error(`Player with role '${role}' not found`);
    }
    return player;
  }

  private firstHandOfCardsActionHandler(action: PlayerAction) {
    console.log("TODO: handle action", action);

    if (action instanceof PassAction) {
      this.setExpectedActions(
        this.filterExpectedActions(
          (a) => a.agent === action.agent && a instanceof PassAction,
        ),
      );
    } else if (action instanceof SelectCardFromSetAction) {
      const player = this.selectPlayerByRole(action.agent);

      const selectedCard = action.getSelectedCard();
      if (selectedCard) {
        player.pickCardsFromDeck(1);
        player.putCardOfHandIntoDeck(selectedCard);
      }
    }
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
