(() => {
  const grid = document.getElementById('sudokuGrid');
  if (!grid) return;
  const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ];
  const solution = [
    [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]
  ];

  grid.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'numeric';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      if (puzzle[r][c]) {
        input.value = puzzle[r][c];
        input.disabled = true;
      }
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^1-9]/g, '');
      });
      grid.appendChild(input);
    }
  }

  document.getElementById('checkSudoku')?.addEventListener('click', () => {
    const cells = [...grid.querySelectorAll('input')];
    let correct = true;
    cells.forEach((cell, idx) => {
      const r = Math.floor(idx / 9), c = idx % 9;
      if (!cell.disabled) {
        const ok = Number(cell.value) === solution[r][c];
        cell.style.borderColor = ok ? '#10b981' : '#ef4444';
        if (!ok) correct = false;
      }
    });
    document.getElementById('sudokuStatus').textContent = correct ? 'Great! Puzzle solved.' : 'Keep going — some numbers are incorrect.';
  });
})();
