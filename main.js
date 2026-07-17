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
