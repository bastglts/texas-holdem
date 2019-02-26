'use strict';

module.exports = function findFirstSpeaker (table, index) {
  const pos = table.positions[index];

  if (pos === 'BTN') {
    return findFirstSpeaker(table, (index + 1));
  }

  const speaker = table.players.filter(player => player.position === pos)[0];

  if (speaker.isAllIn) {
    return findFirstSpeaker(table, (index + 1));
  } else {
    return speaker.username;
  }
};
