document.addEventListener('DOMContentLoaded', function(){
  var toggle = document.querySelector('.mobile-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle){
    toggle.addEventListener('click', function(){
      links.classList.toggle('open');
    });
  }
  document.querySelectorAll('.nav-links > li.dropdown > a').forEach(function(a){
    a.addEventListener('click', function(e){
      if(window.innerWidth <= 960){
        e.preventDefault();
        var parent = a.parentElement;
        var isOpen = parent.classList.contains('dd-open');
        document.querySelectorAll('.nav-links > li').forEach(function(li){li.classList.remove('dd-open');});
        if(!isOpen) parent.classList.add('dd-open');
      }
    });
  });

  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){io.observe(el);});
  } else {
    revealEls.forEach(function(el){el.classList.add('in');});
  }

  // highlight active nav tab
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > li > a').forEach(function(a){
    var href = a.getAttribute('href').split('#')[0];
    if(href === path){ a.classList.add('active'); }
  });
});

/* ---- Carousel arrow scrolling ---- */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('[data-carousel]').forEach(function(shell){
    var track = shell.querySelector('.carousel-track, .gallery-track');
    var prev = shell.querySelector('.car-prev');
    var next = shell.querySelector('.car-next');
    if(!track) return;
    var step = 320;
    if(prev) prev.addEventListener('click', function(){ track.scrollBy({left:-step, behavior:'smooth'}); });
    if(next) next.addEventListener('click', function(){ track.scrollBy({left:step, behavior:'smooth'}); });
  });

  /* ---- Pill tab filtering ---- */
  document.querySelectorAll('[data-pill-group]').forEach(function(group){
    var groupName = group.getAttribute('data-pill-group');
    var pills = group.querySelectorAll('.pill');
    var cards = document.querySelectorAll('[data-belongs-to="'+groupName+'"]');
    pills.forEach(function(pill){
      pill.addEventListener('click', function(){
        pills.forEach(function(p){p.classList.remove('active');});
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');
        cards.forEach(function(card){
          if(filter === 'all' || card.getAttribute('data-category') === filter){
            card.hidden = false;
          } else {
            card.hidden = true;
          }
        });
      });
    });
  });
});

/* ---- Expert bio cards: tap-to-toggle for touch devices (hover still works via CSS) ---- */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.expert-item').forEach(function(item){
    var trigger = item.querySelector('.expert-avatar');
    if(!trigger) return;
    trigger.addEventListener('click', function(e){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.expert-item.open').forEach(function(o){o.classList.remove('open');});
      if(!isOpen) item.classList.add('open');
    });
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.expert-item')){
      document.querySelectorAll('.expert-item.open').forEach(function(o){o.classList.remove('open');});
    }
  });
});

/* ---- Email capture popup with first-visit discount ---- */
(function(){
  var STORAGE_KEY = 'elevatePopupShown';
  function buildPopup(){
    var overlay = document.createElement('div');
    overlay.className = 'site-popup-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML =
      '<div class="site-popup">' +
        '<button class="sp-close" aria-label="Close">&times;</button>' +
        '<span class="sp-discount">Save 15%</span>' +
        '<h3>Before You Go</h3>' +
        '<p>Join the list and take 15% off your first month of Rise or Core.</p>' +
        '<form class="newsletter-form" onsubmit="return false;">' +
          '<input type="email" placeholder="you@business.com" required aria-label="Email address">' +
          '<button type="submit" class="btn btn-gold">Claim 15%</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    function close(){ overlay.classList.remove('show'); }
    overlay.querySelector('.sp-close').addEventListener('click', close);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
    overlay.querySelector('form').addEventListener('submit', function(){
      overlay.querySelector('.site-popup').innerHTML = '<button class="sp-close" aria-label="Close">&times;</button><span class="sp-discount">You\'re In</span><h3>Check Your Inbox</h3><p>Your 15% code is on its way. Welcome to the room.</p>';
      overlay.querySelector('.sp-close').addEventListener('click', close);
      setTimeout(close, 2600);
    });
    document.addEventListener('keydown', function esc(e){
      if(e.key === 'Escape'){ close(); document.removeEventListener('keydown', esc); }
    });
    requestAnimationFrame(function(){ overlay.classList.add('show'); });
  }

  document.addEventListener('DOMContentLoaded', function(){
    try{
      if(!sessionStorage.getItem(STORAGE_KEY)){
        setTimeout(function(){
          buildPopup();
          sessionStorage.setItem(STORAGE_KEY, '1');
        }, 14000);
      }
    }catch(err){
      // storage unavailable — skip popup rather than error
    }
  });
})();

/* ---- Pillar Explorer (offer.html): click a pillar, update the panel ---- */
document.addEventListener('DOMContentLoaded', function(){
  var peItems = document.querySelectorAll('.pe-item');
  if(!peItems.length) return;
  var panelTitle = document.querySelector('.pe-panel-title');
  var riseEl = document.querySelector('[data-pe-field="rise"]');
  var coreEl = document.querySelector('[data-pe-field="core"]');
  var ascendEl = document.querySelector('[data-pe-field="ascend"]');
  var videoLabels = document.querySelectorAll('[data-pe-video-label]');
  var kinds = ['Masterclass Replay', 'Workshop Recording', 'Diagnostic Highlight'];

  function activate(item){
    peItems.forEach(function(p){ p.classList.remove('active'); });
    item.classList.add('active');
    var shortName = item.getAttribute('data-short') || item.getAttribute('data-pillar-name');
    if(panelTitle) panelTitle.textContent = item.getAttribute('data-pillar-name');
    if(riseEl) riseEl.textContent = item.getAttribute('data-rise');
    if(coreEl) coreEl.textContent = item.getAttribute('data-core');
    if(ascendEl) ascendEl.textContent = item.getAttribute('data-ascend');
    videoLabels.forEach(function(el, i){ el.textContent = shortName + ' — ' + kinds[i]; });
  }

  peItems.forEach(function(item){
    item.addEventListener('click', function(){ activate(item); });
  });
  activate(peItems[0]);
});
