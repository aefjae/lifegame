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
