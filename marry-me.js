(function initProposal() {
  const card = document.getElementById('proposal-card');
  const ringButton = document.getElementById('ring-button');
  const ringPrompt = document.getElementById('ring-prompt');
  const answerButton = document.getElementById('answer-button');
  const answerNote = document.getElementById('answer-note');
  const answerStatus = document.getElementById('answer-status');

  function openRing() {
    if (card.classList.contains('ring-open')) return;

    card.classList.add('ring-open');
    ringButton.setAttribute('aria-pressed', 'true');
    ringButton.setAttribute('aria-label', 'Ring box opened');
    ringPrompt.textContent = 'A small beginning.';
  }

  ringButton.addEventListener('click', openRing);

  answerButton.addEventListener('click', function () {
    if (card.classList.contains('answered')) return;

    openRing();
    card.classList.add('answered');
    answerButton.disabled = true;
    answerButton.textContent = 'A promise, kept';
    answerNote.setAttribute('aria-hidden', 'false');
    answerStatus.textContent = "Then let's build it one ordinary, beautiful day at a time.";
  });
})();
