'use strict';

/* -------------------- Dependencies ---------------------- */
const compareHands = require('../../services/hand/sort/src/compare');


module.exports = (players) => {
  // Sort players from best to worse hand
  const sortedPlayers = players
    .sort((plyrA, plyrB) => compareHands(plyrA.hand, plyrB.hand))
    .reverse();

  let winners = [];

  // Check for ties
  for (let i = 0; i < sortedPlayers.length; i++) {
    // Push player to winners array
    winners.push(sortedPlayers[i]);

    // If we arrive to last player, there is no next player to compare hands with (hence the break)
    if (i === (sortedPlayers.length - 1)) {
      break;
    }

    // Compare current player's hand with next player's
    const comp = compareHands(sortedPlayers[i].hand, sortedPlayers[i + 1].hand);

    // If current player has best hand, break the loop, we've found the winner(s)
    if (comp === 1) {
      break;
    }
  }

  return winners;
};
