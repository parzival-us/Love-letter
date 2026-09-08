(function initProposal() {
  const card = document.getElementById('proposal-card');
  const ringButton = document.getElementById('ring-button');
  const ringPrompt = document.getElementById('ring-prompt');
  const answerButton = document.getElementById('answer-button');
  const notNowButton = document.getElementById('not-now-button');
  const proposalNote = document.getElementById('proposal-note');
  const answerNote = document.getElementById('answer-note');
  const answerStatus = document.getElementById('answer-status');
  const WEB3FORMS_ACCESS_KEY = window.LOVE_LETTER_FORM_CONFIG?.web3formsAccessKey || '';
  let isSubmitting = false;

  function openRing() {
    if (card.classList.contains('ring-open')) return;

    card.classList.add('ring-open');
    ringButton.setAttribute('aria-pressed', 'true');
    ringButton.setAttribute('aria-label', 'Ring box opened');
    ringPrompt.textContent = 'A small beginning.';
  }

  ringButton.addEventListener('click', openRing);

  async function submitAnswer(choice, selectedButton) {
    if (isSubmitting) return;

    isSubmitting = true;
    answerButton.disabled = true;
    notNowButton.disabled = true;
    proposalNote.disabled = true;
    selectedButton.textContent = 'Sending...';
    answerStatus.textContent = 'Sending your answer...';

    const note = proposalNote.value.trim();
    const responseLabel = choice === 'yes' ? 'Yes, always' : 'No, not right now';
    let delivered = false;

    if (WEB3FORMS_ACCESS_KEY) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: 'Proposal response',
            message: 'Proposal response: ' + responseLabel + (note ? '\n\nNote: ' + note : ''),
          }),
        });
        const result = await response.json().catch(function () { return {}; });
        delivered = response.ok && result.success !== false;
      } catch (error) {
        console.error('Failed to send proposal response:', error);
      }
    }

    if (choice === 'yes') {
      openRing();
      answerButton.textContent = 'A promise, kept';
      answerNote.textContent = "Then let's build it one ordinary, beautiful day at a time.";
    } else {
      card.classList.add('declined');
      notNowButton.textContent = 'Thank you for answering';
      answerNote.textContent = 'Thank you for answering honestly.';
    }

    card.classList.add('answered');
    answerNote.setAttribute('aria-hidden', 'false');
    answerStatus.textContent = delivered
      ? 'Your answer has been sent.'
      : 'Your answer could not be sent. Please share it directly so it is not missed.';
  }

  answerButton.addEventListener('click', function () { submitAnswer('yes', answerButton); });
  notNowButton.addEventListener('click', function () { submitAnswer('not-now', notNowButton); });
})();
