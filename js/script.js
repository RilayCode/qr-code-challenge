(() => {
  const card = document.querySelector('.card');
  const heading = card.querySelector('.detail h1');
  const paragraph = card.querySelector('.detail p');
  const imgWrapper = card.querySelector('.img');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const typeText = (el, text, speed) => new Promise((resolve) => {
    el.textContent = '';
    const caret = document.createElement('span');
    caret.className = 'caret';
    el.appendChild(caret);

    let i = 0;
    const tick = () => {
      if (i < text.length) {
        caret.insertAdjacentText('beforebegin', text[i]);
        i += 1;
        setTimeout(tick, speed);
      } else {
        caret.remove();
        resolve();
      }
    };
    tick();
  });

  const revealParagraph = () => paragraph.classList.add('reveal');

  const runIntro = async () => {
    const title = heading.textContent.trim();
    if (reduceMotion) {
      heading.textContent = title;
      revealParagraph();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 550));
    await typeText(heading, title, 32);
    setTimeout(revealParagraph, 150);
  };

  const initTilt = () => {
    if (reduceMotion) return;
    const maxTilt = 9;

    const handleMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${(x * maxTilt * 2).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-y * maxTilt * 2).toFixed(2)}deg`);
    };

    const resetTilt = () => {
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };

    card.addEventListener('pointerenter', () => card.classList.add('tilting'));
    card.addEventListener('pointermove', handleMove);
    card.addEventListener('pointerleave', resetTilt);
  };

  const initRipple = () => {
    imgWrapper.addEventListener('pointerdown', (event) => {
      const rect = imgWrapper.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      imgWrapper.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  };

  runIntro();
  initTilt();
  initRipple();
})();
