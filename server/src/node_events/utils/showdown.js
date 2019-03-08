'use strict';

/* -------------------- Dependencies ---------------------- */
const determineWinners = require('./determineWinners');
const startHand = require('../listeners/startHand');

module.exports = async (table, io) => {
  // Get last players
  const players = table.players.filter(plyr => !plyr.hasFolded);

  players.forEach(ply => {
    io.in(table.name).emit('msg', {
      msg: `${ply.username} shows ${ply.holeCards.join(', ')} (has ${ply.hand.name}).`,
    });
  });


  if (!table.sidePots.length) {
    table.sidePots.push({
      claimers: players.map(ply => ply.username),
      value: table.pot,
    });
  }


  for (let i = table.sidePots.length - 1; i >= 0; i--) {
    const pot = table.sidePots[i];

    const players = table.players.filter(plyr => pot.claimers.includes(plyr.username));

    const winners = determineWinners(players);

    if (i === (table.sidePots.length - 1)) {
      table.bestCards = winners[0].hand.handStr.split(' ');

      io.in(table.name).emit('update_table', table);
    }

    const winningAmount = (pot.value / winners.length);

    const msgEnd = (i === 0) ? 'main pot' : `side pot #${i}`;

    // Loop over players
    for (const player of table.players) {
      // Find the winner(s)
      if (winners.includes(player)) {
        player.count += winningAmount;

        io.in(table.name).emit('msg', {
          msg: `${player.username} wins $${winningAmount} (${msgEnd})`,
        });
      }
    }
  }


  await table.save();

  // Wait 4sec before starting next round
  setTimeout(() => {
    startHand({ tableName: table.name, io: io });
  }, 4000);
};
