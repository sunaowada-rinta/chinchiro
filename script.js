/**
 * チンチロ - 丁半サイコロ
 * 3つのサイコロを振って役を表示するアプリ
 */

(function () {
  const ROLL_DURATION_MS = 800;
  const ROLL_INTERVAL_MS = 80;

  const cup = document.getElementById("cup");
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");
  const dice3 = document.getElementById("dice3");
  const resultLabel = document.getElementById("resultLabel");
  const resultDesc = document.getElementById("resultDesc");
  const resultEl = document.getElementById("result");
  const rollBtn = document.getElementById("rollBtn");
  const helpModal = document.getElementById("helpModal");
  const helpBtn = document.getElementById("helpBtn");
  const modalClose = document.getElementById("modalClose");

  function randomDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function setDiceFace(el, value) {
    if (!el) return;
    el.dataset.face = String(value);
  }

  /**
   * チンチロの役を判定する
   * @param {[number, number, number]} values - 3つの出目（昇順ソート済みを想定可）
   * @returns {{ name: string, description: string, type: 'win'|'lose'|'normal' }}
   */
  function judgeYaku(values) {
    const [a, b, c] = [...values].sort((x, y) => x - y);

    // ピンゾロ: 1-1-1
    if (a === 1 && b === 1 && c === 1) {
      return { name: "ピンゾロ", description: "1・1・1 — 最高役！", type: "win" };
    }

    // ゾロ: 同じ目3つ（2〜6）
    if (a === b && b === c) {
      return { name: "ゾロ", description: `${a}・${a}・${a} — アラシ`, type: "win" };
    }

    // シゴロ: 4-5-6
    if (a === 4 && b === 5 && c === 6) {
      return { name: "シゴロ", description: "4・5・6 — 強役", type: "win" };
    }

    // ヒフミ: 1-2-3
    if (a === 1 && b === 2 && c === 3) {
      return { name: "ヒフミ", description: "1・2・3 — 即負け", type: "lose" };
    }

    // 通常役: 同じ目が2つ
    const counts = {};
    values.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const pair = Object.entries(counts).find(([, n]) => n === 2);
    if (pair) {
      const pairNum = Number(pair[0]);
      const solo = values.find((v) => v !== pairNum);
      return {
        name: "通常役",
        description: `目 ${pairNum}${pairNum}・${solo}（${pairNum}の${solo > pairNum ? "上" : "下"}）`,
        type: "normal",
      };
    }

    // 役なし
    return {
      name: "役なし",
      description: `${a}・${b}・${c} — 負け`,
      type: "lose",
    };
  }

  function showResult(yaku) {
    resultLabel.textContent = yaku.name;
    resultDesc.textContent = yaku.description;
    resultEl.classList.remove("win", "lose");
    if (yaku.type === "win") resultEl.classList.add("win");
    if (yaku.type === "lose") resultEl.classList.add("lose");
  }

  function rollDice() {
    rollBtn.disabled = true;
    resultLabel.textContent = "…";
    resultDesc.textContent = "";
    resultEl.classList.remove("win", "lose");

    cup.classList.add("rolling");
    [dice1, dice2, dice3].forEach((d) => d.classList.add("rolling"));

    let count = 0;
    const maxCount = Math.ceil(ROLL_DURATION_MS / ROLL_INTERVAL_MS);
    const intervalId = setInterval(() => {
      setDiceFace(dice1, randomDice());
      setDiceFace(dice2, randomDice());
      setDiceFace(dice3, randomDice());
      count++;
      if (count >= maxCount) {
        clearInterval(intervalId);
        const v1 = Number(dice1.dataset.face);
        const v2 = Number(dice2.dataset.face);
        const v3 = Number(dice3.dataset.face);
        cup.classList.remove("rolling");
        [dice1, dice2, dice3].forEach((d) => d.classList.remove("rolling"));
        const yaku = judgeYaku([v1, v2, v3]);
        showResult(yaku);
        rollBtn.disabled = false;
      }
    }, ROLL_INTERVAL_MS);
  }

  rollBtn.addEventListener("click", rollDice);

  helpBtn.addEventListener("click", () => {
    helpModal.showModal();
  });

  modalClose.addEventListener("click", () => {
    helpModal.close();
  });

  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) helpModal.close();
  });

  // 初期表示
  setDiceFace(dice1, 1);
  setDiceFace(dice2, 2);
  setDiceFace(dice3, 3);
  resultLabel.textContent = "—";
})();
