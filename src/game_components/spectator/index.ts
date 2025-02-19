import User from "../user";

export default class Spectator {
  readonly user: User;

  constructor(user: User) {
    this.user = user;
  }
}
