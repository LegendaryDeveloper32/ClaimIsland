export const PEARL_HUNT_SPEECH = {
  pearl_hunt: {
    welcome: {
      text: `Welcome, traveller! You'll need to connect your wallet before being able to participate in the pearl hunt.`,
      next: false,
      dismiss: false,
      skip: false,
    },
    welcome_connected: {
      text: `Welcome to the Clam Island Pearl Hunt Event! With the right Pearl, you could win a Tiffany & Co pearl necklace worth up to $10,000!`,
      next: `claim`,
      dismiss: false,
      skip: false,
    },
    enter: {
      text: `You need to have a pearl with specific traits and colors to participate in the hunt.`,
      next: false,
      dismiss: false,
      skip: false,
    },
    winner: {
      text: `Congrats you won the pearl hunt competition! Please enter in contact with the team on Telegram or Discord.`,
      next: false,
      dismiss: true,
      skip: false,
    },
    processing: {
      text: `Hold on while we process your transaction...`,
      next: `congrats`,
      dismiss: false,
      skip: false,
    },
    congrats: {
      text: `Your transaction was successfully processed! We will announce once the pearl hunt winner when the time comes.`,
      next: "collection",
      dismiss: true,
      skip: false,
    },
    error: {
      text: `I'm sorry, something went wrong. Please try again.`,
      next: false,
      dismiss: false,
      skip: false,
    },
  },
};

export const PEARL_HUNT_BUTTONS = {};
