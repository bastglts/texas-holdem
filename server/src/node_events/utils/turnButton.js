'use strict';

module.exports = function turnButton (buttonSeat, occupiedSeats) {
  const nextButtonSeat = (buttonSeat === 5) ? 0 : (buttonSeat + 1);

  if (occupiedSeats.includes(nextButtonSeat)) {
    return nextButtonSeat;
  } else {
    return turnButton(nextButtonSeat, occupiedSeats);
  }
};
