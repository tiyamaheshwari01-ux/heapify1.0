(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const ui = {
    input: $("arrayInput"), generate: $("generateBtn"), random: $("randomBtn"),
    tree: $("heapTree"), bars: $("arrayBars"), size: $("arraySize"),
    comparisons: $("comparisons"), swaps: $("swaps"), phase: $("phase"),
    status: $("completionStatus"), previous: $("previousBtn"), next: $("nextBtn"),
    play: $("playBtn"), reset: $("resetBtn"), speed: $("speed"),
    speedLabel: $("speedLabel"), counter: $("stepCounter"),
    progress: $("progressBar"), explanation: $("explanation"), hint: $("inputHint"),
    lastIndex: $("lastIndex")
  };

  let history = [];
  let position = 0;
  let timer = null;
  let sourceArray = [];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function record(array, phase, message, comparisons, swaps, activeSize,
                  compared = [], swapped = [], sorted = [], action = "info") {
    history.push({
      array: [...array], phase, message, comparisons, swaps, activeSize,
      compared: [...compared], swapped: [...swapped], sorted: [...sorted], action
    });
  }

  function buildHistory(input) {
    const a = [...input];
    const n = a.length;
    let comparisons = 0;
    let swaps = 0;
    const sorted = [];

    record(a, "Starting", "This is the original array. We will first rearrange it into a Max Heap.", 0, 0, n);

    function heapify(heapSize, root) {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;

      if (left < heapSize) {
        comparisons++;
        record(a, "Building Max Heap",
          `Compare parent ${a[root]} at index ${root} with its left child ${a[left]} at index ${left}.`,
          comparisons, swaps, heapSize, [root, left], [], sorted, "compare");
        if (a[left] > a[largest]) largest = left;
      }

      if (right < heapSize) {
        comparisons++;
        record(a, "Building Max Heap",
          `Compare ${a[right]} at index ${right} with the current largest candidate ${a[largest]} at index ${largest}.`,
          comparisons, swaps, heapSize, [largest, right], [], sorted, "compare");
        if (a[right] > a[largest]) largest = right;
      }

      if (largest !== root) {
        const first = a[root], second = a[largest];
        [a[root], a[largest]] = [a[largest], a[root]];
        swaps++;
        record(a, "Heapify · Swap",
          `${second} is larger than ${first}. Swap them so the largest value moves toward the parent position.`,
          comparisons, swaps, heapSize, [], [root, largest], sorted, "swap");
        heapify(heapSize, largest);
      } else {
        record(a, "Heapify · Complete",
          `The subtree rooted at index ${root} now satisfies the Max Heap property.`,
          comparisons, swaps, heapSize, [root], [], sorted, "settled");
      }
    }

    // Bottom-up construction: begin at the last non-leaf node.
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      record(a, "Building Max Heap",
        `Start heapifying the subtree at index ${i}. Leaves already satisfy the heap property.`,
        comparisons, swaps, n, [i], [], sorted, "info");
      heapify(n, i);
    }

    record(a, "Max Heap Created",
      `Max Heap built. The root value ${a[0]} is the largest value in the active heap.`,
      comparisons, swaps, n, [0], [], sorted, "root");

    // Repeatedly move the root maximum to the end of the active heap.
    for (let end = n - 1; end > 0; end--) {
      const maximum = a[0];
      [a[0], a[end]] = [a[end], a[0]];
      swaps++;
      sorted.push(end);
      record(a, "Extract Maximum",
        `Move the root maximum ${maximum} to index ${end}. That position is now sorted; the active heap shrinks to ${end} elements.`,
        comparisons, swaps, end, [], [0, end], sorted, "extract");
      heapify(end, 0);
    }

    if (n > 0) sorted.push(0);
    record(a, "Completed",
      `Heap Sort is complete. The array is in ascending order: ${a.join(", ")}.`,
      comparisons, swaps, 0, [], [], sorted, "done");
    return history;
  }

  function nodeColor(index, step) {
    if (step.sorted.includes(index)) return "#20c9a6";
    if (step.swapped.includes(index)) return "#ef6b73";
    if (step.compared.includes(index)) return "#f5b84b";
    if (index === 0 && step.phase === "Max Heap Created") return "#20c9a6";
    return "#4285f4";
  }

  function renderTree(step) {
    const values = step.array;
    if (!values.length) {
      ui.tree.innerHTML = '<div class="empty-state">No elements to display.</div>';
      return;
    }

    const levels = Math.floor(Math.log2(values.length)) + 1;
    const width = 640;
    const levelGap = 76;
    const height = Math.max(150, levels * levelGap + 24);
    const positions = values.map((_, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const firstAtLevel = (2 ** level) - 1;
      const offset = index - firstAtLevel;
      const count = 2 ** level;
      return { x: width * (offset + 0.5) / count, y: 30 + level * levelGap };
    });

    let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Binary heap tree">`;
    values.forEach((_, index) => {
      if (index === 0) return;
      const parent = Math.floor((index - 1) / 2);
      const p = positions[parent], c = positions[index];
      svg += `<line class="tree-edge" x1="${p.x}" y1="${p.y + 19}" x2="${c.x}" y2="${c.y - 19}"/>`;
    });
    values.forEach((value, index) => {
      const p = positions[index];
      const fill = nodeColor(index, step);
      const opacity = index >= step.activeSize && !step.sorted.includes(index) ? 0.35 : 1;
      svg += `<circle class="tree-node" cx="${p.x}" cy="${p.y}" r="19" fill="${fill}" opacity="${opacity}"/>`;
      svg += `<text class="tree-value" x="${p.x}" y="${p.y + 1}" opacity="${opacity}">${escapeHtml(value)}</text>`;
    });
    svg += "</svg>";
    ui.tree.innerHTML = svg;
  }

  function renderBars(step) {
    const values = step.array;
    if (!values.length) {
      ui.bars.innerHTML = '<div class="empty-state">No elements to display.</div>';
      return;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    ui.bars.innerHTML = values.map((value, index) => {
      const height = 34 + ((value - min) / range) * 145;
      const opacity = index >= step.activeSize && !step.sorted.includes(index) ? 0.35 : 1;
      return `<div class="bar-item" title="Index ${index}: ${value}">
        <span class="bar-value">${escapeHtml(value)}</span>
        <div class="bar" style="height:${height}px;background:${nodeColor(index, step)};opacity:${opacity}"></div>
        <span class="bar-index">${index}</span>
      </div>`;
    }).join("");
    ui.lastIndex.textContent = `INDEX ${values.length - 1}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function render() {
    if (!history.length) return;
    const step = history[position];
    renderTree(step);
    renderBars(step);
    ui.size.textContent = sourceArray.length;
    ui.comparisons.textContent = step.comparisons;
    ui.swaps.textContent = step.swaps;
    ui.phase.textContent = step.phase;
    ui.status.textContent = step.phase === "Completed" ? "Sorting complete" : "In progress";
    ui.explanation.textContent = step.message;
    ui.counter.textContent = `Step ${position + 1} of ${history.length}`;
    ui.progress.style.width = `${((position + 1) / history.length) * 100}%`;
    ui.previous.disabled = position === 0;
    ui.next.disabled = position === history.length - 1;
    ui.reset.disabled = false;
    ui.play.disabled = position === history.length - 1;
    ui.play.textContent = timer ? "Ⅱ Pause" : "▶ Play";
  }

  function parseInput() {
    const raw = ui.input.value.trim();
    if (!raw) return { error: "Please enter at least one integer." };
    const tokens = raw.split(/[,\s]+/).filter(Boolean);
    if (tokens.length > 15) return { error: "Please enter no more than 15 integers for a clear visualization." };
    const values = [];
    for (const token of tokens) {
      if (!/^[+-]?\d+$/.test(token)) return { error: `"${token}" is not a valid integer. Use commas or spaces between integers.` };
      const number = Number(token);
      if (!Number.isSafeInteger(number)) return { error: "Please enter safe integers only." };
      values.push(number);
    }
    return { values };
  }

  function generate() {
    stopPlayback();
    const parsed = parseInput();
    if (parsed.error) {
      ui.hint.textContent = parsed.error;
      ui.hint.classList.add("error");
      return;
    }
    ui.hint.textContent = "Input accepted. Follow each comparison, swap, and extraction below.";
    ui.hint.classList.remove("error");
    sourceArray = [...parsed.values];
    history = [];
    position = 0;
    buildHistory(sourceArray);
    render();
  }

  function stopPlayback() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    if (ui.play) ui.play.textContent = "▶ Play";
  }

  function play() {
    if (!history.length || position >= history.length - 1) return;
    if (timer !== null) {
      stopPlayback();
      return;
    }
    const delays = [1500, 1100, 800, 520, 300];
    timer = setInterval(() => {
      if (position < history.length - 1) {
        position++;
        render();
      } else {
        stopPlayback();
        render();
      }
    }, delays[Number(ui.speed.value) - 1]);
    render();
  }

  ui.generate.addEventListener("click", generate);
  ui.input.addEventListener("keydown", (event) => { if (event.key === "Enter") generate(); });
  ui.random.addEventListener("click", () => {
    const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 91) - 20);
    ui.input.value = values.join(", ");
    generate();
  });
  ui.previous.addEventListener("click", () => {
    stopPlayback();
    if (position > 0) { position--; render(); }
  });
  ui.next.addEventListener("click", () => {
    stopPlayback();
    if (position < history.length - 1) { position++; render(); }
  });
  ui.play.addEventListener("click", play);
  ui.reset.addEventListener("click", () => {
    stopPlayback();
    if (!history.length) return;
    position = 0;
    render();
  });
  ui.speed.addEventListener("input", () => {
    const labels = ["Very slow", "Slow", "Normal", "Fast", "Very fast"];
    ui.speedLabel.textContent = labels[Number(ui.speed.value) - 1];
    if (timer !== null) {
      stopPlayback();
      play();
    }
  });

  // Show a useful initial preview; Generate Heap still builds a fresh history from input.
  const initial = parseInput();
  if (!initial.error) {
    sourceArray = [...initial.values];
    history = [];
    buildHistory(sourceArray);
    position = 0;
    render();
  }
})();
