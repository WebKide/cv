/**
 * js/settings_page.js
 * Theme (dark default / light opt-in / system), and a contact footer.
 */
 
function settings_page_init(page) {
  const content = page.querySelector('.gutter');
  content.innerHTML = '';
 
  /* ─── Theme ─── */
  const themeList = ons.createElement(`
    <ons-list class="glassy" style="margin:15px 0;">
      <ons-list-header modifier="material" style="text-align:center; opacity:.6; font-size:16px; font-weight:700; width:100%; margin-top:8px; color:var(--highlight-color);">Color de la Aplicación</ons-list-header>
    </ons-list>
  `);
 
  const themes = [
    { mode: 'system', label: 'Configuración predeterminada del sistema' },
    { mode: 'light', label: 'Aruṇa (Claro)' },
    { mode: 'dark', label: 'Śyāma (Oscuro)' }
  ];
 
  let activeThemeSwitch = null;
 
  themes.forEach((theme) => {
    const isChecked = (appState.themeMode || 'system') === theme.mode;
 
    const item = ons.createElement(`
      <ons-list-item tappable>
        <div class="center">${theme.label}</div>
        <div class="right">
          <ons-switch ${isChecked ? 'checked' : ''}></ons-switch>
        </div>
      </ons-list-item>
    `);
 
    const sw = item.querySelector('ons-switch');
    if (isChecked) activeThemeSwitch = sw;
 
    sw.addEventListener('change', (e) => {
      // Prevent unchecking the already-selected option
      if (!e.target.checked) {
        if (activeThemeSwitch === e.target) {
          e.target.checked = true; // bounce back
        }
        return;
      }
 
      // Uncheck previous
      if (activeThemeSwitch && activeThemeSwitch !== e.target) {
        activeThemeSwitch.checked = false;
      }
      activeThemeSwitch = e.target;
 
      appState.themeMode = theme.mode;
      dbSetItem('themeMode', theme.mode);
      apply_theme();
    });
 
    themeList.appendChild(item);
  });
 
  content.appendChild(themeList);
 
  /* Footer */
  content.appendChild(ons.createElement(`
    <ons-list-header style="text-transform:none; font-size:.85rem; background-image:none; text-align:center;">
      ✦ Si tienes preguntas, sugerencias o quieres reportar errores, ponte en contacto con: <a href="https://github.com/WebKide/vedaversity/tree/main">WebKide</a>
    </ons-list-header>
  `));
 
  /* ─── Font ─── */
  const fontList = ons.createElement(`
    <ons-list class="glassy" style="margin:15px 0;">
      <ons-list-header modifier="material" style="text-align:center; opacity:.6; font-size:16px; font-weight:700; width:100%; margin-top:8px; color:var(--highlight-color);">Estilo de Fuente</ons-list-header>
    </ons-list>
  `);
 
  const fonts = [
    { value: "'Kelvinch', serif",          label: 'Kelvinch (Tradicional)' },
    { value: "'Ubuntu', sans-serif",       label: 'Ubuntu (Moderno)' },
    { value: "'Charis SIL', serif",        label: 'Charis SIL (Literario)' },
    { value: "'Nunito Sans', sans-serif",  label: 'Nunito Sans (Limpio)' },
    { value: "'Gentium Book', serif",      label: 'Gentium Book (Clásico)' },
    { value: "'Sassoon', sans-serif",      label: 'Sassoon (Leible)' },
    { value: "'Libre Baskerville', serif", label: 'Baskerville (Formal)' },
    { value: "'Sansita', sans-serif",      label: 'Sansita (Expresivo)' }
  ];
 
  let activeFontSwitch = null;
 
  fonts.forEach((font) => {
    const isChecked = appState.fontFamily === font.value;
 
    const item = ons.createElement(`
      <ons-list-item tappable>
        <div class="center" style="font-family: ${font.value}">${font.label}</div>
        <div class="right">
          <ons-switch ${isChecked ? 'checked' : ''}></ons-switch>
        </div>
      </ons-list-item>
    `);
 
    const sw = item.querySelector('ons-switch');
    if (isChecked) activeFontSwitch = sw;
 
    sw.addEventListener('change', (e) => {
      // Prevent unchecking the already-selected option
      if (!e.target.checked) {
        if (activeFontSwitch === e.target) {
          e.target.checked = true; // bounce back
        }
        return;
      }
 
      // Uncheck previous
      if (activeFontSwitch && activeFontSwitch !== e.target) {
        activeFontSwitch.checked = false;
      }
      activeFontSwitch = e.target;
 
      appState.fontFamily = font.value;
      dbSetItem('fontFamily', font.value);
      apply_font();
    });
 
    fontList.appendChild(item);
  });
 
  fontList.appendChild(ons.createElement(`
    <ons-list>
      <ons-list-header
        modifier="material"
        style="text-align:center; opacity:.6; font-size:16px; font-weight:700; width:100%; margin-top:8px;">
        Texto de muestra
      </ons-list-header>
 
      <ons-list-header class="sample-text">
        khaḍgaḥ śāntaṁ jñānaṁ dadāti ।<br />
        gaṅgāyāṁ ṛṣiḥ kuṇḍe tiṣṭhati ।<br />
        pañca ṭīkāḥ, ṣaḍ granthāḥ ।<br />
        (kḷptaḥ) śubhaṁ bhavatu ॥
      </ons-list-header>
    </ons-list>
  `));
 
  content.appendChild(fontList);
 
  /* ─── App Update ─── */
  const updateBlock = ons.createElement(`
    <ons-list class="glassy" style="margin:15px 0;">
      <ons-list-header modifier="material" style="text-align:center; opacity:.6; font-size:16px; font-weight:700; width:100%; margin-top:8px; color:var(--highlight-color);">Actualización</ons-list-header>
      <ons-list-item id="forceUpdateBtn" tappable>
        <div class="left">
          <svg class="update-icon" viewBox="0 0 24 24" width="32" height="32" fill="var(--highlight-color)">
            <path d="M11 7v5.4l3.8 3.8 1.4-1.4-3.2-3.2V7zm10-3h-2v2.3c-1.6-2-4.2-3.3-7-3.3-5 0-9 4-9 9s4 9 9 9c4.4 0 8.1-3.2 8.9-7.5h-2c-.7 3.1-3.5 5.5-6.9 5.5-3.9 0-7-3.1-7-7s3.1-7 7-7c2.4 0 4.5 1.2 5.7 3H15v2h6z"/>
          </svg>
        </div>
        <div class="center">
          <div class="update-title" style="font-weight:600;">Busca actualizaciones</div>
          <div class="update-subtitle" style="font-size:0.8rem; opacity:0.7;">verificar manualmente si hay una nueva versión</div>
        </div>
      </ons-list-item>
    </ons-list>
  `);
  content.appendChild(updateBlock);
 
  const updateBtn = updateBlock.querySelector('#forceUpdateBtn');
  const uTitle    = updateBtn.querySelector('.update-title');
  const uSub      = updateBtn.querySelector('.update-subtitle');
  const uIcon     = updateBtn.querySelector('.update-icon');
 
  const resetUpdate = () => {
    updateBtn.classList.remove('is-working', 'is-success', 'is-error');
    uTitle.textContent = 'Busca actualizaciones';
    uSub.textContent   = 'verificar manualmente si hay una nueva versión';
    uIcon.style.fill   = 'var(--highlight-color)';
  };
 
  updateBtn.addEventListener('click', async () => {
    if (updateBtn.classList.contains('is-working')) return;
 
    /* Second tap when update is ready → install & reload */
    if (updateBtn.classList.contains('is-success')) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        return;
      }
    }
 
    if (!('serviceWorker' in navigator)) {
      updateBtn.classList.add('is-error');
      uTitle.textContent = 'Actualización no disponible';
      uSub.textContent   = 'No se admiten los service workers';
      uIcon.style.fill   = '#f44336';
      setTimeout(resetUpdate, 2500);
      return;
    }
 
    updateBtn.classList.add('is-working');
    uTitle.textContent = 'Buscando actualizaciones';
    uSub.textContent   = 'espera por favor';
 
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) throw new Error('no registration');
 
      await reg.update();
      await new Promise(r => setTimeout(r, 800));
 
      updateBtn.classList.remove('is-working');
 
      if (reg.waiting) {
        updateBtn.classList.add('is-success');
        uTitle.textContent = 'Actualización lista';
        uSub.textContent   = 'toca para instalar y reiniciar';
        uIcon.style.fill   = '#4caf50';
      } else if (reg.installing) {
        updateBtn.classList.add('is-working');
        uTitle.textContent = 'Descargando la actualización';
        uSub.textContent   = 'espera por favor';
        await new Promise(r => setTimeout(r, 2000));
        updateBtn.classList.remove('is-working');
        if (reg.waiting) {
          updateBtn.classList.add('is-success');
          uTitle.textContent = 'Actualización lista';
          uSub.textContent   = 'toca para instalar y reiniciar';
          uIcon.style.fill   = '#4caf50';
        } else {
          updateBtn.classList.add('is-success');
          uTitle.textContent = 'No hay versión nueva';
          uSub.textContent   = 'actualmente estás al día';
          uIcon.style.fill   = '#4caf50';
          setTimeout(resetUpdate, 2500);
        }
      } else {
        updateBtn.classList.add('is-success');
        uTitle.textContent = 'No se encontró versión nueva';
        uSub.textContent   = 'actualmente estás al día';
        uIcon.style.fill   = '#4caf50';
        setTimeout(resetUpdate, 2500);
      }
    } catch (err) {
      console.error('[ForceUpdate]', err);
      updateBtn.classList.remove('is-working');
      updateBtn.classList.add('is-error');
      uTitle.textContent = 'La verificación falló';
      uSub.textContent   = 'inténtalo de nuevo más tarde';
      uIcon.style.fill   = '#f44336';
      setTimeout(resetUpdate, 2500);
    }
  });
}