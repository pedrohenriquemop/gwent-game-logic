import Game from "..";
import { GameStatus } from "../../../utils/types";
import { PassAction, SelectCardFromSetAction } from "../../action";
import { mockedPlayer1, mockedPlayer2 } from "./mocks/mock";

test("Game init flow", () => {
  const game = new Game(mockedPlayer1, mockedPlayer2);

  game.startGame();

  const [player1, player2] = game.getPlayers();
  expect(player1.getHand().length).toBe(10);
  expect(player2.getHand().length).toBe(10);

  expect(game.getStatus()).toBe(GameStatus.WAITING);
  const expectedActions = game.getExpectedActions();
  expect(expectedActions.length).toBe(6);

  const player1PassAction = expectedActions.find(
    (action) =>
      action.agent === player1.getRole() && action instanceof PassAction,
  ) as PassAction;
  const player2PassAction = expectedActions.find(
    (action) =>
      action.agent === player2.getRole() && action instanceof PassAction,
  ) as PassAction;

  expect(player1PassAction).toBeDefined();
  expect(player2PassAction).toBeDefined();

  game.addResolvedAction(player1PassAction.resolve());
  expect(game.getStatus()).toBe(GameStatus.WAITING);

  const player2SelectCardActions = expectedActions.filter(
    (action) =>
      action.agent === player2.getRole() &&
      action instanceof SelectCardFromSetAction,
  ) as SelectCardFromSetAction[];

  expect(player2SelectCardActions.length).toBe(2);

  player2SelectCardActions.forEach((action) => {
    game.addResolvedAction(action.resolve(0));

    expect(player1.getHand().length).toBe(10);
    expect(game.getStatus()).toBe(GameStatus.WAITING);
  });

  game.addResolvedAction(player2PassAction.resolve());
  expect(game.getStatus()).toBe(GameStatus.READY);
});
