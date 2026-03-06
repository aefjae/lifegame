// Typewriter — demo card user answers
(function () {
  var answers = [
    'become a graphic designer',
    'quit pornography',
    'learn to code',
    'be a better father',
    'start my own business',
    'lose 20 pounds',
    'write a book',
    'save my marriage',
    'get out of debt',
    'learn to play guitar',
    'leave my 9-to-5',
    'get sober',
    'run a marathon',
  ];

  var el = document.getElementById('ls-typewriter');
  if (!el) return;

  var current = 0, charIndex = 0, deleting = false;

  function tick() {
    var word = answers[current];
    if (!deleting) {
      el.textContent = word.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 65);
    } else {
      el.textContent = word.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        current = (current + 1) % answers.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    }
  }

  setTimeout(tick, 600);
})();

// Fade/slide word cycler — subhead rotating word
(function () {
  var words = [
    'dreams', 'goals', 'targets', 'ambitions',
    'vision', 'potential', 'purpose', 'aspirations',
    'plans', 'desires', 'intentions', 'future',
  ];

  var slot = document.getElementById('ls-word-slot');
  if (!slot) return;

  var i = 0;

  setInterval(function () {
    i = (i + 1) % words.length;

    slot.classList.add('ls-word-exit');

    setTimeout(function () {
      slot.textContent = words[i];
      slot.classList.remove('ls-word-exit');
      slot.classList.add('ls-word-enter');

      setTimeout(function () {
        slot.classList.remove('ls-word-enter');
      }, 300);
    }, 300);
  }, 2500);
})();
