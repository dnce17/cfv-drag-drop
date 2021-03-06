const from = document.querySelector('.from');
var fill = document.querySelectorAll('.fill');
const empties = document.querySelectorAll('.empty');
const damage = document.querySelector('#damage');
const deck = document.querySelector('#deck');
const hand = document.querySelector('#hand');
const counter = document.querySelectorAll('.counter');
const drop = document.querySelector('#drop');
const search = document.querySelector('.search');
const exit = document.querySelector('.exit');
const searchHolder = document.querySelector('.search_container');
const vanguard = document.querySelector('#VC');
const soul = document.querySelector('.soul');

// Fill listeners
for (const filled of fill) {
  filled.addEventListener('dragstart', dragStart);
  filled.addEventListener('dragend', dragEnd);
  filled.addEventListener('click', tap);
  filled.addEventListener('click', blast);
}

//NEW

// Loop through empty boxes and add listeners
for (const empty of empties) {
  empty.addEventListener('dragover', dragOver);
  empty.addEventListener('dragenter', dragEnter);
  empty.addEventListener('dragleave', dragLeave);
  empty.addEventListener('drop', dragDrop);
}

function dragStart() {
  // console.log('start')
  if (this.classList.toggle('tap')) {
    this.classList.toggle('tap')
  }
  if (this.classList.contains('blasted')) {
    this.classList.remove('blasted');
  }
  setTimeout(() => (this.className = 'invisible'), 0);
}

function dragEnd() {
  // console.log('end')
  if (damage.contains(this)) {
    this.className = 'fill';
    this.className += ' tap'
  } else {
    this.className = 'fill';
  }
}

// it is safe to include preventDefault in case the the browser works against you 

function dragOver(e) {
  // console.log('over');
  e.preventDefault();
  if (this.classList.contains('hovered') == false) {
    this.className += ' hovered';
  }
}

function dragEnter(e) {
  // console.log('enter');
  e.preventDefault();
}

function dragLeave() {
  // console.log('leave');
  this.className = 'empty';
}

function dragDrop() {
  // console.log('drop');
  this.className = 'empty';
  for (const filled of fill) {
    if (this.getAttribute('id') == 'deck' && filled.classList.contains('invisible')) {
      this.insertBefore(filled, this.lastElementChild);
    } else if (filled.classList.contains('invisible')) {
      this.append(filled);
    }
  }
}

function tap() {
  const noTap = [0, 4, 8];
  for (const val of noTap) {
    if (empties[val].contains(this)) {
    } else {
      if (this.classList.contains('tap') == false) {
        this.className += ' tap';
      } else {
        this.classList.toggle('tap');
      }
    }
  }
}

function blast() {
  if (damage.contains(this)) {
    if (this.classList.contains('blasted') == false) {
      this.className += ' blasted';
    } else {
      this.classList.toggle('blasted');
    }
  }
}

var deckCount = deck.getElementsByTagName("img").length;
deck.addEventListener('click', draw);
function draw() {
  var randCard = Math.floor(Math.random() * deckCount)
  if (this.children[randCard].getAttribute('draggable')) {
    hand.appendChild(this.children[randCard]);
  }
}

counter[1].textContent = deckCount;
const deckAmt = new MutationObserver(mutations => {
  mutations.forEach(record => {
    if (record.addedNodes.length > 0) {
      deckCount = deck.getElementsByTagName("img").length;
      counter[1].textContent = deckCount;
    }
    if (record.removedNodes.length > 0) {
      deckCount = deck.getElementsByTagName("img").length;
      counter[1].textContent = deckCount;
    }
  })
})

deckAmt.observe(deck, {
  childList: true
})

var dropCount = drop.getElementsByTagName("img").length
counter[2].textContent = dropCount;
const dropAmt = new MutationObserver(mutations => {
  mutations.forEach(record => {
    if (record.addedNodes.length > 0) {
      dropCount = drop.getElementsByTagName("img").length
      counter[2].textContent = dropCount;
      // console.log('drop +');
    }
    if (record.removedNodes.length > 0) {
      dropCount = drop.getElementsByTagName("img").length
      counter[2].textContent = dropCount;
      // console.log('drop -');
    }
  })
})

dropAmt.observe(drop, {
  childList: true
})

var soulCount = vanguard.getElementsByTagName("img").length - 1;
soul.textContent = 'Soul: ' + soulCount;
const soulAmt = new MutationObserver(mutations => {
  mutations.forEach(record => {
    if (record.addedNodes.length > 0) {
      soulCount = vanguard.getElementsByTagName("img").length - 1;
      soul.textContent = 'Soul: ' + soulCount;
    }
    if (record.removedNodes.length > 0) {
      soulCount = vanguard.getElementsByTagName("img").length - 1;
      if (soulCount + 1 == 0) {
        return;
      } else {
        soul.textContent = 'Soul: ' + soulCount;
      }
    }
  })
})

soulAmt.observe(vanguard, {
  childList: true
})

var damageCount = damage.getElementsByTagName("img").length
counter[0].textContent = damageCount;
const damageAmt = new MutationObserver(mutations => {
  mutations.forEach(record => {
    if (record.addedNodes.length > 0) {
      damageCount = damage.getElementsByTagName("img").length
      counter[0].textContent = damageCount;
    }
    if (record.removedNodes.length > 0) {
      damageCount = damage.getElementsByTagName("img").length
      counter[0].textContent = damageCount;
    }
  })
})

damageAmt.observe(damage, {
  childList: true
})

search.addEventListener('click', searcher);
drop.addEventListener('click', searcher);
soul.addEventListener('click', searcher);

function searcher() {
  if (this.classList.contains('over') == false) {
    this.classList.toggle('over');
  } else {
    this.classList.toggle('over');
  }

  if (searchHolder.classList.contains('disappear')) {
    searchHolder.classList.toggle('disappear');
    if (this.classList.contains('deck_btn')) {
      from.textContent = 'Deck';
      on(searchHolder, deck);
    } else if (this.id == 'drop') {
      from.textContent = 'Drop';
      on(searchHolder, drop);
    } else {
      from.textContent = 'Soul';
      on(searchHolder, vanguard);
    }
    evtToNew(searchHolder);
  }
}

function on(target, origin) {
  for (const child of origin.children) {
    if (child.getAttribute('draggable')) {
      // console.log(child);
      var cln = child.cloneNode(true);
      cln.addEventListener('click', remove);

      if (origin == vanguard && child == origin.lastElementChild) {
        console.log(origin.lastElementChild);
        return;
      } else {
        target.appendChild(cln);
      }

    }
  }
}

function remove() {
  if (searchHolder.contains(this)) {
    // console.log('no poop');
    hand.appendChild(this);
  }
}

function evtToNew(target) {
  fill = document.querySelectorAll('.fill');
  for (const filled of fill) {
    if (target.contains(filled)) {
      addEvt(filled);
    }
  }
}

function off(target) {
  // console.log('else');
  target.classList.toggle('disappear');
  var card = target.lastElementChild;
  // console.log(card);
  while (card) {
    if (card.tagName == 'BUTTON') {
      // console.log('the button')
      break;
    }
    target.removeChild(card);
    card = target.lastElementChild;
  }
}

exit.addEventListener('click', close);
function close() {
  off(searchHolder);
  if (search.classList.contains('over')) {
    search.classList.toggle('over');
  } else if (drop.classList.contains('over')) {
    drop.classList.toggle('over');
  } else if (soul.classList.contains('over')) {
    soul.classList.toggle('over');
  }
}

function addEvt(target) {
  target.addEventListener('dragstart', dragStart);
  target.addEventListener('dragend', dragEnd);
  target.addEventListener('click', tap);
  target.addEventListener('click', blast);
}

const deckSearch = new MutationObserver(mutations => {
  mutations.forEach(record => {
    // I might be sth here. Maybe if we put back the item we took out in search cont
    // if (record.addedNodes.length > 0) {
    //   // console.log('drop +');
    // }
    if (record.removedNodes.length > 0) {
      if (search.classList.contains('over') == false) {
        // console.log('erss');
      } else {
        // console.log('drop -');
        const removed = record.removedNodes[0];
        for (var i = 0; i < deck.childElementCount; i++) {
          if (removed.src == deck.children[i].src) {
            deck.removeChild(deck.children[i]);
            break;
          }
        }
      }
    }
  })
})

deckSearch.observe(searchHolder, {
  childList: true
})

const dropSearch = new MutationObserver(mutations => {
  mutations.forEach(record => {
    if (record.removedNodes.length > 0) {
      if (drop.classList.contains('over') == false) {
        // console.log('erss');
      } else {
        // console.log('drop -');
        const removed = record.removedNodes[0];
        for (var i = 0; i < drop.childElementCount; i++) {
          if (removed.src == drop.children[i].src) {
            drop.removeChild(drop.children[i]);
            break;
          }
        }
      }
    }
  })
})

dropSearch.observe(searchHolder, {
  childList: true
})

const soulSearch = new MutationObserver(mutations => {
  mutations.forEach(record => {
    if (record.removedNodes.length > 0) {
      if (soul.classList.contains('over') == false) {
        // console.log('erss');
      } else {
        // console.log('drop -');
        const removed = record.removedNodes[0];
        for (var i = 0; i < vanguard.childElementCount; i++) {
          if (removed.src == vanguard.children[i].src) {
            vanguard.removeChild(vanguard.children[i]);
            break;
          }
        }
      }
    }
  })
})

soulSearch.observe(searchHolder, {
  childList: true
})

// NEW
const buttons = document.querySelectorAll('.switch');
for (const btn of buttons) {
  console.log(btn);
  btn.addEventListener('click', press);
  // btn.addEventListener('click', lock);
}

function press() {
  if (this.classList.contains('pressed')) {
    this.classList.toggle('pressed');
  } else {
    this.className += ' pressed';
  }
  for (const other of buttons) {
    if (other != this && other.classList.contains('pressed')) {
      other.classList.toggle('pressed');
    }
  }
}

// function lock() {
//   if (this.classList.contains('blasted') == false) {
//     this.className += ' blasted';
//   } else {
//     this.classList.toggle('blasted');
//   }
// }