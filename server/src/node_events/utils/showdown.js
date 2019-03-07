'use strict';

/* -------------------- Dependencies ---------------------- */
const determineWinners = require('./determineWinners');
const startHand = require('../listeners/startHand');

module.exports = async (table, io) => {
  // Reveal river card (if fast-forward scenario) or players' cards (normal scenario)
  io.in(table.name).emit('update_table', table);

  /* -------------- Determine winner or split ---------- */
  if (!table.sidePots.length) {
    const players = table.players.filter(plyr => !plyr.hasFolded);

    const winners = determineWinners(players);

    const winningAmount = (table.pot / winners.length);

    // Loop over players
    for (const player of table.players) {
      // Find the winner(s)
      if (winners.includes(player.username)) {
        player.count += winningAmount;
        io.in(table.name).emit('msg', { msg: `${player.username} wins ${winningAmount}` });
      }
    }
  } else {
    console.log('sidePots', table.sidePots);

    for (let i = table.sidePots.length - 1; i >= 0; i--) {
      const pot = table.sidePots[i];
      console.log('pot', pot);

      const players = table.players.filter(plyr => pot.claimers.includes(plyr.username));
      console.log('players', players);

      const winners = determineWinners(players);
      console.log('winners', winners);

      const winningAmount = (pot.value / winners.length);
      console.log('amount', winningAmount);

      const msgEnd = (i === 0) ? 'main pot' : `side pot #${i}`;

      // Loop over players
      for (const player of table.players) {
        // Find the winner(s)
        if (winners.includes(player.username)) {
          console.log('winner', player.username);
          player.count += winningAmount;
          io.in(table.name).emit('msg', {
            msg: `${player.username} wins ${winningAmount} (${msgEnd})`,
          });
        }
      }
    }
  }

  await table.save();

  // Wait 4sec before starting next round
  setTimeout(() => {
    io.in(table.name).emit('update_table', table);

    startHand({ tableName: table.name, io: io });
  }, 4000);
};
