import Game from "../game_components/game";

test('Game init should log "Game init"', () => {
  console.log = jest.fn();
  const game = new Game();
  game.init();
  expect(console.log).toHaveBeenCalledWith("Game init");
});
