let style = {font: '14px Arial', fill: '#fff'};

window.gameEmitter = new window.EventEmitter();

export default {
  init: function(gameTime, totalDeaths, playerName) {
      this.GAME_TIME = gameTime;
      this.DEATH_COUNT = totalDeaths;
      this.PLAYER_NAME = playerName;
  },
  create: function(){
    if (this.GAME_TIME < 200) this.game.add.text(10, 70, `You beat the game in ${this.GAME_TIME}! Nice time!!!`, style)
    else this.game.add.text(10, 70, `You beat the game in ${this.GAME_TIME}! Not too shabby!`, style)
    if (this.DEATH_COUNT < 5) this.game.add.text(10, 100, `Looks like you died only ${this.DEATH_COUNT} times too!`, style)
    else this.game.add.text(10, 100, `But you did die ${this.DEATH_COUNT} times... Hey, be more careful next time!`, style)
    window.gameEmitter.emit('finalScore', {name: this.PLAYER_NAME, time: this.GAME_TIME, deaths: this.DEATH_COUNT})
  }
}
