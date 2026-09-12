const CATEGORY_MAP={
  'Capital & Profit':'Money & Profit',
  'Offers & Assets':'Offers & Products',
  'Authority & Demand':'Brand & Content',
  'Revenue':'Sales & Launch',
  'Operations':'CEO Operations'
};

const PRODUCTS=[
  {slug:'the-wealth-operating-system',title:'The Wealth Operating System',category:'Money & Profit',price:39},
  {slug:'the-profit-clarity-planner',title:'The Profit Clarity Planner',category:'Money & Profit',price:29},
  {slug:'the-premium-offer-architect',title:'The Premium Offer Architect',category:'Offers & Products',price:79},
  {slug:'brand-with-weight',title:'Brand With Weight',category:'Brand & Content',price:89},
  {slug:'the-digital-product-studio',title:'The Digital Product Studio',category:'Offers & Products',price:59},
  {slug:'the-signature-content-system',title:'The Signature Content System',category:'Brand & Content',price:49},
  {slug:'the-calm-launch-playbook',title:'The Calm Launch Playbook',category:'Sales & Launch',price:69},
  {slug:'the-elevated-sales-page-kit',title:'The Elevated Sales Page Kit',category:'Sales & Launch',price:39},
  {slug:'the-solo-ceo-operating-desk',title:'The Solo CEO Operating Desk',category:'CEO Operations',price:79}
];

const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

function replaceExactText(root=document){
  root.querySelectorAll('*').forEach(el=>{
    if(el.children.length===0){
      const text=el.textContent.trim();
      if(CATEGORY_MAP[text]) el.textContent=CATEGORY_MAP[text];
    }
  });
}

function setCopy(){
  const nav=[...document.querySelectorAll('header nav a')];
  if(nav[0]) nav[0].textContent='Library';
  if(nav[1]) nav[1].textContent='Business House';
  if(nav[2]) nav[2].textContent='About';

  const hero=document.querySelector('.hero');
  if(hero){
    const eyebrow=hero.querySelector('.hero-copy .eyebrow');
    const heading=hero.querySelector('.hero-copy h1');
    const lead=hero.querySelector('.hero-copy .lead');
    if(eyebrow) eyebrow.textContent='THE CAMILLE LIBRARY · BUSINESS & WEALTH';
    if(heading) heading.innerHTML='Build something<br><em>substantial.</em>';
    if(lead) lead.textContent='Nine focused business systems for women building stronger offers, clearer profit, sharper brands, calmer launches, and companies that can actually hold their ambition.';
  }

  const about=document.querySelector('.about-intro');
  if(about){
    const p=about.querySelector(':scope > p:last-child');
    if(p) p.textContent='The Camille Library is a business and wealth library for women building serious companies from their ideas, expertise, and digital products. Every edition is designed to move a real business decision forward: what to sell, how to position it, how to launch it, how to manage the money, and how to operate without chaos.';
  }

  const house=document.querySelector('.house-hero');
  if(house){
    const eyebrow=house.querySelector('.eyebrow');
    const intro=house.querySelector(':scope > p:not(.eyebrow)');
    const note=house.querySelector('.price-note span');
    if(eyebrow) eyebrow.textContent='PRIVATE COMMUNITY · MEMBERSHIP · OPENING SOON';
    if(intro) intro.textContent='The Camille Business House is the private membership community behind the library: ongoing planning, implementation, accountability, and thoughtful company for women building something substantial.';
    if(note) note.textContent='monthly membership when the doors open · no charge today';
  }
}

function applyAvailability(){
  const match=location.pathname.match(/^\/books\/([^/]+)/);
  if(!match) return;
  const slug=match[1];
  const product=PRODUCTS.find(p=>p.slug===slug);
  const catalog=window.__camilleCatalog;
  if(!product||!catalog) return;

  const shop=catalog[slug];
  const available=shop?.variants?.find(v=>v.availableForSale);
  const anyVariant=shop?.variants?.[0];
  const price=Number((available||anyVariant)?.price?.amount||product.price);

  document.querySelectorAll('[data-add]').forEach(button=>{
    if(!available){
      button.disabled=true;
      button.setAttribute('aria-disabled','true');
      button.textContent='Temporarily unavailable';
      button.classList.add('is-unavailable');
    }
  });

  const buyPrice=document.querySelector('.buy-row strong');
  if(buyPrice) buyPrice.textContent=money(price);
  const finalButton=document.querySelector('.final-cta [data-add]');
  if(finalButton&&available) finalButton.textContent='Acquire · '+money(price);
}

function ensureProductSections(){
  const match=location.pathname.match(/^\/books\/([^/]+)/);
  if(!match) return;
  const slug=match[1];
  const current=PRODUCTS.find(p=>p.slug===slug);
  if(!current) return;

  const inside=document.querySelector('.inside');
  if(inside){
    const labels=inside.querySelectorAll('.eyebrow');
    if(labels[0]) labels[0].textContent='THE OUTCOME';
    if(labels[1]) labels[1].textContent="WHAT'S INSIDE";
  }

  const how=document.querySelector('.how');
  if(how){
    const label=how.querySelector('.eyebrow');
    const h2=how.querySelector('h2');
    if(label) label.textContent='HOW TO USE IT';
    if(h2) h2.innerHTML='Read it once.<br><em>Operate from it repeatedly.</em>';
  }

  if(!document.querySelector('.related-next')&&how){
    const related=PRODUCTS.filter(p=>p.slug!==slug&&p.category===current.category)
      .concat(PRODUCTS.filter(p=>p.slug!==slug&&p.category!==current.category))
      .slice(0,3);
    const section=document.createElement('section');
    section.className='related-next';
    section.innerHTML='<div class="section-head"><div><p class="eyebrow">RELATED NEXT STEPS</p><h2>Continue the build.</h2></div><a class="arrow-link dark" href="/library" data-enhanced-link>View full library <span>↗</span></a></div><div class="related-grid">'+related.map(p=>'<a class="related-card" href="/books/'+p.slug+'" data-enhanced-link><span>'+p.category+'</span><h3>'+p.title+'</h3><strong>'+money(p.price)+'</strong></a>').join('')+'</div>';
    how.insertAdjacentElement('afterend',section);
    section.querySelectorAll('[data-enhanced-link]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState({},'',a.getAttribute('href'));window.dispatchEvent(new PopStateEvent('popstate'));}));
  }
}

function enhance(){
  replaceExactText();
  setCopy();
  ensureProductSections();
  applyAvailability();
}

let raf=0;
const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(enhance)};
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('camille:catalog',schedule);
window.addEventListener('popstate',schedule);
schedule();
