import axios from 'axios';
import Vue from 'vue';

let vm = new Vue({
	el: "#leaderboard",
  data: {
    leaderboardData: []
  },
  render(h) {
    return h('div', {
      'class': {
        'is-red': this.isRed
      }
    }, [
      h('hr'),
      h('h1', 'LEADERBOARDS'),
      h('ol', this.leaderboardData.map(player => h('li', `${player.name} TIME: ${player.time} DEATHS: ${player.deaths}`)))
    ])
  },
  created: function(){
    axios.get('/leaderboard')
    .then(res => res.data)
    .then(leaderboard => {
      this.leaderboardData = leaderboard.reverse();
    })
  }
})

export default vm
