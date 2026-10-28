/**
 * js/home_page.js
 * The persistent root "shell" — Home and Lists tabs, plus the search box,
 * recents list, and the 3-item grid (All Songs / Pronunciation / Settings).
 */
 
function shell_page_init(page) {
  const navEl = document.getElementById('navigator');
 
  const tabHome = page.querySelector('#tab-home');
  const tabLists = page.querySelector('#tab-lists');
  const btnHome = page.querySelector('#tabBtnHome');
  const btnLists = page.querySelector('#tabBtnLists');
 
  function activateTab(name) {
    const isHome = name === 'home';
    tabHome.style.display = isHome ? 'block' : 'none';
    tabLists.style.display = isHome ? 'none' : 'block';
    btnHome.classList.toggle('active', isHome);
    btnLists.classList.toggle('active', !isHome);
 
    if (isHome) {
      render_recentListItems(page);
      updateHomeImageSize();
    } else {
      render_customLists(page);
      render_tattvaLists(page);
    }
  }
 
  btnHome.onclick = () => activateTab('home');
  btnLists.onclick = () => activateTab('lists');
 
  // --- Home tab wiring ---
  const searchTrigger = page.querySelector('#search-trigger');
  if (searchTrigger) {
    searchTrigger.onclick = () => navEl.pushPage('tmpl-search');
  }
 
  page.querySelector('#allSongs').onclick = () => navEl.pushPage('tmpl-all-songs');
  page.querySelector('#authorsBtn').onclick = () => navEl.pushPage('tmpl-authors');
  page.querySelector('#pronounceGuide').onclick = () => navEl.pushPage('tmpl-pronounce');
  page.querySelector('#settingsBtn').onclick = () => navEl.pushPage('tmpl-settings');
 
  // --- Home logotype version caption tap (flip/reveal moved here) ---
  const logoWrap = page.querySelector('.home-logo-wrap');
  let captionTimer;
  if (logoWrap) {
    logoWrap.addEventListener('click', () => {
      logoWrap.classList.add('is-visible');
      clearTimeout(captionTimer);
      captionTimer = setTimeout(() => {
        logoWrap.classList.remove('is-visible');
      }, 5200);
    });
  }

  // --- Home image: grows on scroll toward the bottom of the Home tab ---
  const imageWrap = page.querySelector('.home-image-wrap');
  const imageContainer = page.querySelector('#tab-home .default_img_container');
  const scrollHost = page.querySelector('.page__content');

  // The container's height is fixed to the FINAL (max) size up front, so
  // total scrollHeight never changes as the image grows — no feedback
  // loop, and no need to recompute a baseline. The image is bottom-
  // anchored inside that reserved box (see CSS), so it grows upward,
  // away from the fixed tabbar, instead of downward into it.
  function reserveHomeImageSpace() {
    if (!imageContainer || !scrollHost) return null;
    const availableWidth = imageContainer.clientWidth - 32;
    const availableHeight = scrollHost.clientHeight - 88 - 32;
    const maxSize = Math.max(150, Math.min(availableWidth, availableHeight, 512));
    imageContainer.style.height = maxSize + 'px';
    return maxSize;
  }

  function updateHomeImageSize() {
    if (!imageWrap || !imageContainer || !scrollHost || !btnHome.classList.contains('active')) return;

    const maxSize = reserveHomeImageSpace();
    if (maxSize === null) return;

    const maxScroll = scrollHost.scrollHeight - scrollHost.clientHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollHost.scrollTop / maxScroll)) : 0;

    const size = 150 + (maxSize - 150) * progress;
    imageWrap.style.setProperty('--home-image-size', size + 'px');
  }

  if (scrollHost) {
    scrollHost.addEventListener('scroll', updateHomeImageSize, { passive: true });
    window.addEventListener('resize', updateHomeImageSize);
    updateHomeImageSize();
  }
 
  // --- Lists tab wiring ---
  page.querySelector('#createListBtn').onclick = () => inputDialogAddListUI(page);
 
  // Recents can change while we're away (e.g. song viewed from a list),
  // so refresh whenever the shell comes back into view.
  page.onShow = () => {
    if (btnHome.classList.contains('active')) render_recentListItems(page);
    else { render_customLists(page); render_tattvaLists(page); }
  };
 
  // --- Recents action buttons (popover) ---
  const menuBtn = page.querySelector('#recentsMenuBtn');
  const popover = page.querySelector('#recentsPopover');
 
  if (menuBtn && popover) {
    menuBtn.onclick = () => {
      popover.show(menuBtn);
    };
  }
 
  const clearBtn = page.querySelector('#btn-clear-recents');
  const createBtn = page.querySelector('#btn-create-list-from-recents');
 
  if (clearBtn) clearBtn.onclick = () => {
    popover.hide();
    window.clearRecents();
  };
  if (createBtn) createBtn.onclick = () => {
    popover.hide();
    window.createListFromRecents();
  };

  // --- Swipe navigation between Home and Lists with edge wave indicator ---
  const waveLeft = document.createElement('div');
  waveLeft.className = 'tab-edge-wave left';
  const waveRight = document.createElement('div');
  waveRight.className = 'tab-edge-wave right';
  page.appendChild(waveLeft);
  page.appendChild(waveRight);

  function releaseEdgeWaves() {
    [waveLeft, waveRight].forEach((w) => {
      w.classList.remove('dragging');
      w.style.opacity = '';
      w.style.transform = '';
    });
  }

  function dragEdgeWave(side, progress) {
    const wave = side === 'left' ? waveLeft : waveRight;
    const other = side === 'left' ? waveRight : waveLeft;
    other.classList.remove('dragging');
    other.style.opacity = '';
    other.style.transform = '';

    const offset = (1 - progress) * 44;
    wave.classList.add('dragging');
    wave.style.opacity = String(0.15 + progress * 0.5);
    wave.style.transform = `translateX(${side === 'left' ? -offset : offset}px)`;
  }

  page.addEventListener('touchmove', (e) => {
    if (!isSwiping || navEl.stackLength > 1) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) < Math.abs(dy) * 1.5) { releaseEdgeWaves(); return; }

    const isHome = btnHome.classList.contains('active');
    const progress = Math.min(1, Math.abs(dx) / 120);

    if (isHome && dx > 0) dragEdgeWave('left', progress);
    else if (!isHome && dx < 0) dragEdgeWave('right', progress);
    else releaseEdgeWaves();
  }, { passive: true });

  page.addEventListener('touchcancel', () => { isSwiping = false; releaseEdgeWaves(); }, { passive: true });

  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  page.addEventListener('touchstart', (e) => {
    // Only allow swipe if we are at the root shell page (Home or Lists)
    if (navEl.stackLength > 1) return;
    if (e.touches.length !== 1) return;
    // Don't trigger if swiping inside an already-interactive horizontal slider (like recents)
    if (e.target.closest('#recents-items, ons-switch, ons-range, .recent-swipe-item')) return;

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  }, { passive: true });

  page.addEventListener('touchend', (e) => {
    releaseEdgeWaves();
    if (!isSwiping || navEl.stackLength > 1) {
      isSwiping = false;
      return;
    }
    isSwiping = false;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Must be predominantly a horizontal swipe of at least 45px
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      const isHome = btnHome.classList.contains('active');

      if (diffX < 0) {
        // Swiping LEFT (finger moves right-to-left)
        if (isHome) {
          activateTab('lists');
        }
      } else {
        // Swiping RIGHT (finger moves left-to-right)
        if (!isHome) {
          activateTab('home');
        }
      }
    }
  }, { passive: true });

  activateTab('home');
}
 
function gen_swipeableRecentItem(text, subtitle, onClick, onDelete) {
  const item = document.createElement('ons-list-item');
  item.setAttribute('tappable', '');
  item.className = 'recent-swipe-item';
  item.innerHTML = `
    <div class="center recent-item-center">
      <div class="list-item-title">${escapeHtml(text)}</div>
      ${subtitle ? `<div class="list-item-author">${escapeHtml(subtitle)}</div>` : ''}
    </div>
    <div class="right recent-delete-btn"
         style="transform:translateX(100%); transition:transform .25s ease;">
 
      <svg viewBox="0 0 24 24"
           width="32"
           height="32"
           fill="#fff"
           aria-hidden="true"
           focusable="false">
        <path d="M15.6 19.5v-2.4h4.8v2.4zm0-9.6V7.5H24v2.4zm0 4.8v-2.4h7.2v2.4zM1.2 7.5H0V5.1h4.8V3.3h4.8v1.8h4.8v2.4h-1.2v10.8c0 .7-.2 1.2-.7 1.7s-1 .7-1.7.7H3.6c-.7 0-1.2-.2-1.7-.7s-.7-1-.7-1.7zm2.4 0v10.8h7.2V7.5zm0 0v10.8z"/>
      </svg>
 
      <span>BORRAR</span>
    </div>
  `;
 
  const center   = item.querySelector('.center');
  const deleteBtn = item.querySelector('.recent-delete-btn');
 
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    onDelete();
  };
 
  let startX = 0, startY = 0, isHorizontal = false, isOpen = false, longPressTimer = null;
  let suppressNextClick = false;
 
  const openSwipe = () => {
    if (isOpen) return;
    isOpen = true;
    center.style.marginRight = '90px';
    deleteBtn.style.transform = 'translateX(0)';
    item.classList.add('swiped');
    suppressNextClick = true;
  };
 
  const closeSwipe = () => {
    if (!isOpen) return;
    isOpen = false;
    center.style.marginRight = '0';
    deleteBtn.style.transform = 'translateX(100%)';
    item.classList.remove('swiped');
  };
 
  /* ---- Swipe ---- */
  item.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isHorizontal = false;
  }, { passive: true });
 
  item.addEventListener('touchmove', (e) => {
    const diffX = Math.abs(startX - e.touches[0].clientX);
    const diffY = Math.abs(startY - e.touches[0].clientY);
    if (diffX > diffY && diffX > 10) isHorizontal = true;
  }, { passive: true });
 
  item.addEventListener('touchend', (e) => {
    if (!isHorizontal) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 60) openSwipe();
    else if (diff < -40) closeSwipe();
  });
 
  /* ---- Tap to navigate, or tap-to-close when open ---- */
  item.addEventListener('click', (e) => {
    if (e.target.closest('.recent-delete-btn')) return;
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    if (isOpen) { closeSwipe(); return; }
    onClick();
  });
 
  /* ---- Long-press / right-click to reveal delete button ---- */
  item.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    longPressTimer = setTimeout(() => {
      openSwipe();
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt =>
    item.addEventListener(evt, () => clearTimeout(longPressTimer))
  );
 
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    openSwipe();
  });
 
  /* Tap elsewhere on the page to close this swipe — delegated to a single
     document-level listener (below) instead of one per item, so listeners
     don't accumulate across re-renders. */
  item._closeSwipe = closeSwipe;

  return item;
}

// Single delegated listener for all swipeable recent-items, installed once.
if (!window._recentSwipeOutsideListenerInstalled) {
  window._recentSwipeOutsideListenerInstalled = true;
  document.addEventListener('click', (e) => {
    document.querySelectorAll('#recents-items .recent-swipe-item.swiped').forEach((el) => {
      if (!el.contains(e.target) && typeof el._closeSwipe === 'function') {
        el._closeSwipe();
      }
    });
  });
}

function render_recentListItems(page) {
  const scope = page || document;
  const container = scope.querySelector('#recents-items');
  const header = scope.querySelector('#recentHeader');
  const recentsWrap = scope.querySelector('#recents');
  if (!container) return;
 
  container.innerHTML = '';
 
  appState.recents.forEach((entry) => {
    let label, subtitle = '', onClick;
 
    if (entry.listName && appState.lists[entry.listName]) {
      const list = appState.lists[entry.listName];
      const pos = list.indexOf(entry.id);
      if (pos === -1) return;
      label = `${entry.listName} (${pos + 1})`;
      onClick = () => showSongViewUI(entry.id, entry.listName);
    } else {
      label = window.getSongTitle(entry.id);
      const rec = window.INDEX && window.INDEX[entry.id];
      subtitle = (rec && rec.title) || '';
      onClick = () => showSongViewUI(entry.id, null);
    }
 
    if (!label) return;
 
    const el = gen_swipeableRecentItem(label, subtitle, onClick, () => {
      removeFromRecents(entry.id, entry.listName || null);
      render_recentListItems(page);
      const title = window.getSongTitle(entry.id) || entry.id;
      if (window.ons) ons.notification.toast(`Título “${title}” eliminado de recientes`, { timeout: 1800 });
    });
 
    const idValue = entry.id;
    if (idValue !== undefined && idValue !== null) {
      el.dataset.songId = idValue;
    }
 
    container.appendChild(el);
  });
 
  const hasRecents = container.children.length > 0;
  header.style.display = hasRecents ? '' : 'none';
  recentsWrap.classList.toggle('glassy', hasRecents);
}
 
// Alias for backward compatibility with app.js
window.renderRecents = render_recentListItems;