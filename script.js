// ===== Smooth scroll for in-page links =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
      navMenu.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded','false');
    }
  })
});

// ===== Burger menu =====
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');
burgerBtn?.addEventListener('click',()=>{
  const open = navMenu.classList.toggle('open');
  burgerBtn.setAttribute('aria-expanded', String(open));
});

// ===== Theme toggle (dark/light) =====
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if(saved) root.setAttribute('data-theme', saved);
themeToggle.textContent = root.getAttribute('data-theme') === 'light' ? '🌙' : '☀️';
themeToggle.addEventListener('click',()=>{
  const theme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  if(theme === 'dark') root.removeAttribute('data-theme'); else root.setAttribute('data-theme','light');
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
});

// ===== Typing effect for tagline (simple) =====
const typing = document.getElementById('typing');
const full = typing.textContent.trim();
typing.textContent = '';
let i=0; 
const type=()=>{
  typing.textContent = full.slice(0,i++); 
  if(i<=full.length) requestAnimationFrame(type);
};
requestAnimationFrame(type);

// ===== Skills bars animate on scroll =====
const bars = document.querySelectorAll('.bar > span');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target; 
      const width = el.getAttribute('data-width') || 0;
      el.animate([{width:'0%'},{width:width+'%'}], {duration:1000, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});
      io.unobserve(el);
    }
  })
},{threshold:.4});
bars.forEach(b=>io.observe(b));

// ===== Testimonials slider =====
const slides = document.getElementById('slides');
const dotsWrap = document.getElementById('dots');
const total = slides.children.length; 
let idx = 0; 
let timer;

const renderDots = ()=>{
  for(let i=0;i<total;i++){
    const d = document.createElement('button'); d.className='dot'; d.setAttribute('aria-label','slide '+(i+1));
    d.addEventListener('click',()=>{ idx=i; update() }); dotsWrap.appendChild(d);
  }
}
const update = ()=>{
  slides.style.transform = `translateX(-${idx * 100}%)`;
  dotsWrap.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active', i===idx));
}
const next = ()=>{ idx = (idx + 1) % total; update() }
renderDots(); 
update(); 
timer = setInterval(next, 4000);

// Pause on hover
slides.addEventListener('mouseenter', ()=>clearInterval(timer));
slides.addEventListener('mouseleave', ()=>timer=setInterval(next,4000));

// ===== Contact form (demo) =====
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Contact form submission', data);
  form.reset();
  formMsg.textContent = 'Thanks! Your message has been Sent';
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== GSAP scroll animations (progressive enhancement) =====
window.addEventListener('load', ()=>{
  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.card, .project-card').forEach((el)=>{
      gsap.from(el, {opacity:0, y:20, duration:.6, ease:'power2.out', scrollTrigger:{trigger:el, start:'top 85%'}});
    });
    gsap.from('.pfp', {scale:.8, opacity:0, duration:.8, ease:'back.out(1.6)'});
  }
});
