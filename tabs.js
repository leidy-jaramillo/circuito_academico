const weekTabs = [...document.querySelectorAll('.week-tabs [role="tab"]')];
function selectWeek(selected, focus = false) {
  weekTabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  if (selected.id === 'tab-week-2') {
    document.querySelectorAll('#week-1 audio').forEach(audio => audio.pause());
    if (typeof playing !== 'undefined') { playing = false; renderUI(); }
  } else {
    requestAnimationFrame(() => {
      if (typeof game !== 'undefined') game.scale.refresh();
    });
  }
  if (focus) selected.focus();
}
weekTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectWeek(tab));
  tab.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % weekTabs.length;
    if (event.key === 'ArrowLeft') target = (index + weekTabs.length - 1) % weekTabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = weekTabs.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    selectWeek(weekTabs[target], true);
  });
});
