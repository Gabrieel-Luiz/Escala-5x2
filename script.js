// =============================
// CONFIGURAÇÃO DAS ESCALAS
// =============================
const C_1 = [0, 1, 0, 1, 1, 1, 1];
const C_2 = [1, 0, 1, 1, 1, 1, 0];
const C_3 = [1, 1, 1, 0, 0, 1, 1];
const C_4 = [1, 0, 1, 1, 1, 0, 1];

const escalas = {
    colab1: [C_1, C_2, C_3, C_1, C_4, C_3],
    colab2: [C_3, C_1, C_2, C_3, C_1, C_4],
    colab3: [C_2, C_3, C_1, C_4, C_3, C_1],
    colab4: [C_1, C_4, C_3, C_1, C_2, C_3],
    colab5: [C_3, C_1, C_4, C_3, C_1, C_2]
};

let viewDate = new Date();
const anchorDate = new Date(2026, 1, 23);

// =============================
// 🔴 FERIADOS NACIONAIS BRASIL
// =============================

function getFixedHolidays(year) {
    return [
        new Date(year, 0, 1),   // 01/01
        new Date(year, 3, 21),  // 21/04
        new Date(year, 4, 1),   // 01/05
        new Date(year, 8, 7),   // 07/09
        new Date(year, 9, 12),  // 12/10
        new Date(year, 10, 2),  // 02/11
        new Date(year, 10, 15), // 15/11
        new Date(year, 11, 25)  // 25/12
    ];
}

function getEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month, day);
}

function getMovableHolidays(year) {
    const easter = getEaster(year);

    const carnival = new Date(easter);
    carnival.setDate(easter.getDate() - 47);

    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);

    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);

    return [carnival, goodFriday, corpusChristi];
}

function getAllHolidays(year) {
    return [
        ...getFixedHolidays(year),
        ...getMovableHolidays(year)
    ];
}

// =============================
// RENDER
// =============================

function render() {

    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('monthTitle');
    const colabId = document.getElementById('colabSelect').value;

    grid.innerHTML = '';

    ['DOM','SEG','TER','QUA','QUI','SEX','SAB'].forEach(d => {
        grid.innerHTML += `<div class="day-name">${d}</div>`;
    });

    title.innerText = viewDate.toLocaleString('pt-br', { 
        month: 'long', 
        year: 'numeric' 
    });

    const holidays = getAllHolidays(viewDate.getFullYear());

    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="day empty"></div>`;
    }

    for (let d = 1; d <= lastDay; d++) {

        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
        const diffDays = Math.floor((date - anchorDate) / (1000 * 60 * 60 * 24));

        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.innerText = d;

        const isHoliday = holidays.some(h =>
            h.getDate() === date.getDate() &&
            h.getMonth() === date.getMonth()
        );

        if (diffDays >= 0) {

            let weekIdx = Math.floor(diffDays / 7) % 6;
            const diaSemana = date.getDay();
            const status = escalas[colabId][weekIdx][diaSemana];

            if (isHoliday) {

                // 🔴 FERIADO VISUAL
                dayEl.classList.add('feriado');

                // 🔹 Mostrar se era FOLGA ou TRABALHO
                if (status === 0) {
                    dayEl.innerHTML += `<span class="status-label status-folga">FOLGA</span>`;
                } else {
                    dayEl.innerHTML += `<span class="status-label status-trabalho">TRAB</span>`;
                }

            } else {

                // comportamento normal
                if (status === 0) {
                    dayEl.classList.add(
                        (diaSemana === 0 || diaSemana === 6)
                        ? 'folga-fds'
                        : 'folga-dia'
                    );
                } else {
                    dayEl.classList.add('trabalho');
                }
            }

            dayEl.innerHTML += `<span class="ciclo-label">C${weekIdx + 1}</span>`;
        }

        grid.appendChild(dayEl);
    }
}

function changeMonth(n) {
    viewDate.setMonth(viewDate.getMonth() + n);
    render();
}

render();



// =============================
// CONTROLE DE ABAS
// =============================

function openTab(event, tabId) {

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function openTab(evt, tabName) {
  var i, tabcontent, tabbuttons;

  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tabbuttons = document.getElementsByClassName("tab-btn");
  for (i = 0; i < tabbuttons.length; i++) {
    tabbuttons[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

let tabelaCarregada = false;

function openTab(evt, tabName) {
  // Esconde todas as abas
  const tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove classe ativa de todos os botões
  const tabbuttons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabbuttons.length; i++) {
    tabbuttons[i].classList.remove("active");
  }

  // Mostra a aba clicada
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
 
}