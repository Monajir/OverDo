import User from '../models/userModel.js';

const messages = {
  friendly: {
    welcome: [
      "Hey there! Ready to be productive? Let's add some tasks! 🌟",
      "Welcome back! Let's make today count! ✨",
    ],
    good: [
      "You're crushing it! Keep up the amazing work! 🌟",
      "Look at you go! Your productivity is inspiring! 💪",
      "Great progress today! You should be proud! ✨",
      "On fire! Keep this momentum going! 🔥",
    ],
    average: [
      "You're doing well! A few more tasks to go! 📈",
      "Keep going! Every task completed matters! 💫",
      "Nice steady pace! Let's keep it up! 🎯",
    ],
    poor: [
      "Hey, it's okay! Everyone has slow days. Pick one task! 🌱",
      "Don't worry! Start small, one pomodoro at a time! 🍅",
      "I believe in you! Let's tackle something easy first! 💖",
    ],
    break: [
      "Enjoy your break! You've earned it! ☕",
      "Relax and recharge! Your brain needs this! 🧘",
      "Take a deep breath. You'll come back stronger! 🌊",
    ],
    overdue: [
      "Some tasks need attention! But no pressure, one at a time! 📋",
      "A few deadlines passed, let's prioritize! You've got this! 🙏",
    ],
  },
  sarcastic: {
    welcome: [
      "Oh, you're here? Let's see if you actually do something today. 😏",
      "Another day, another empty to-do list. Shall we change that? 🙄",
    ],
    good: [
      "Oh wow, you're actually being productive? Color me shocked. 😏",
      "Look who decided to show up and do work! 👏",
      "I'm... actually impressed? Don't let it go to your head. 🙄",
    ],
    average: [
      "Mediocre effort, but I'll take it. 😒",
      "Could be worse. Could also be much better. Just saying. 💅",
      "You're like a car in second gear. Functional, not exciting. 🚗",
    ],
    poor: [
      "Are you working or just staring at the screen? 🤔",
      "Your to-do list called. It misses you. 📞",
      "At this rate, your tasks will complete themselves... eventually. 🐌",
    ],
    break: [
      "Another break? Sure, it's not like you have deadlines. ☕",
      "Taking a break from what, exactly? 🧐",
    ],
    overdue: [
      "Overdue tasks? What a surprise! (Not really.) 📅",
      "Your deadlines just called. They're very disappointed. 😤",
    ],
  },
  aggressive: {
    welcome: [
      "GET IN HERE! Time to WORK! No excuses today! ⚡",
      "Stop standing around! Add some tasks and GET MOVING! 🔥",
    ],
    good: [
      "THAT'S what I'm talking about! DON'T STOP NOW! 🔥",
      "KEEP PUSHING! You're a MACHINE! 💪",
      "YES! DESTROY that to-do list! SHOW NO MERCY! ⚡",
    ],
    average: [
      "Is that ALL you've got?! PUSH HARDER! 😤",
      "COME ON! You can do BETTER than this! MOVE IT! 🏃",
      "Average is NOT acceptable! LEVEL UP! NOW! 💥",
    ],
    poor: [
      "GET. TO. WORK. NOW! No excuses! 😡",
      "WHAT ARE YOU DOING?! STOP SLACKING! GO! GO! GO! ⚡",
      "Your tasks aren't going to complete themselves! MOVE! 🔥",
    ],
    break: [
      "Fine. Take your break. But come back STRONGER! 💪",
      "Break time. Don't get too comfortable! ⏰",
    ],
    overdue: [
      "OVERDUE TASKS?! THIS IS UNACCEPTABLE! FIX IT NOW! 🚨",
      "Your overdue tasks are a DISGRACE! GET ON THEM! 😤",
    ],
  }
};

export async function getMessages(req, res) {
  try {
    const user = await User.findById(req.userId).select('preferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.preferences.reactionMode === 'friendly') {
      res.json(messages.friendly);
    } else if (user.preferences.reactionMode === 'sarcastic') {
      res.json(messages.sarcastic);
    } else if (user.preferences.reactionMode === 'aggressive') {
      res.json(messages.aggressive);
    } else {
      res.json(messages.friendly); // default to friendly if something's wrong
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
}