'use strict';

module.exports = (table, allInPlayers, remainingPlayers) => {
  // Get all players that have bet during the round (this excludes players that are all-in since
  // previous rounds) and the total amount of their bets at the same time
  let thisRoundTotalBets = 0;

  const plyrsBettingThisRound = remainingPlayers.filter(plyr => {
    if (plyr.lastBet) {
      thisRoundTotalBets += plyr.lastBet;
      return true;
    }
    return false;
  });


  // Get new players that are all-in this round potentially creating new side pot
  // and sort them from lowest to highest bet
  const plyrsAllInThisRound = allInPlayers
    .filter(plyr => plyr.lastBet !== 0)
    .sort((plyrA, plyrB) => plyrA.lastBet - plyrB.lastBet);

  // If no new player shoved this round
  if (!plyrsAllInThisRound.length) {
    let lastSidePot = table.sidePots[table.sidePots.length - 1];

    const newPot = lastSidePot.claimers.filter(ply => !plyrsBettingThisRound.includes(ply)).length;

    // If no pot was created at the end of last round (case where the players just flat called the
    // last all-in(s)) and the players still playing have bet in this round, their bets go in a new
    // pot that we must create now
    if (thisRoundTotalBets && newPot) {
      table.sidePots.push({
        claimers: plyrsBettingThisRound.map(ply => ply.username),
        value: thisRoundTotalBets,
      });

      lastSidePot = table.sidePots[table.sidePots.length - 1];
    }

    lastSidePot.value += thisRoundTotalBets;
  } else {
    // If there was no side pot until now mainPotSoFar has a non-zero value (expect pre-flop)
    const mainPotSoFar = (table.sidePots.length === 0) ? (table.pot - thisRoundTotalBets) : 0;

    // Main pot or new side pot (the first of this betting round)
    table.sidePots.push({
      claimers: plyrsBettingThisRound.map(ply => ply.username),
      initiators: [plyrsAllInThisRound[0].username],
      extract: plyrsAllInThisRound[0].lastBet,
      value: mainPotSoFar + (plyrsAllInThisRound[0].lastBet * plyrsBettingThisRound.length),
    });


    thisRoundTotalBets -= (plyrsAllInThisRound[0].lastBet * plyrsBettingThisRound.length);

    // If necessary, create a side pot for every other all-in caller/raiser of this round
    for (let i = 1; i < plyrsAllInThisRound.length; i++) {
      const player = plyrsAllInThisRound[i];
      const lastSidePot = table.sidePots[table.sidePots.length - 1];
      const extract = player.lastBet - lastSidePot.extract;

      // If this player went all-in for the same amount that last side pot initiator,
      // we don't create a new one, he will be part of that last side pot
      if (extract) {
        const claimers = lastSidePot.claimers.filter(ply => !lastSidePot.initiators.includes(ply));

        table.sidePots.push({
          claimers: claimers,
          initiators: [player.username],
          extract: extract,
          value: extract * claimers.length,
        });

        thisRoundTotalBets -= extract * claimers.length;
      } else {
        lastSidePot.initiators.push(player.username);
      }
    }

    // Finally if there still at least two non all-in players, they can continue the hand between
    // themselves by betting in an other side pot
    const claimers = plyrsBettingThisRound
      .filter(ply => !plyrsAllInThisRound.includes(ply))
      .map(ply => ply.username);

    if (claimers.length && thisRoundTotalBets) {
      table.sidePots.push({
        claimers: claimers,
        value: thisRoundTotalBets,
      });
    }
  }
};
