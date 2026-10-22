// Cabeçalho e botão do WhatsApp aparecem depois do topo
const topo = document.getElementById('topo');
const whats = document.getElementById('abrirWhats');
const aoRolar = () => {
  const passou = window.scrollY > window.innerHeight * 0.6;
  topo.classList.toggle('visivel', passou);
  whats.classList.toggle('visivel', window.scrollY > 200);
};
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

// Menu no celular
const abrirMenu = document.getElementById('abrirMenu');
abrirMenu.addEventListener('click', () => {
  const aberto = topo.classList.toggle('menu-aberto');
  abrirMenu.setAttribute('aria-expanded', aberto);
});
document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => topo.classList.remove('menu-aberto')));

// Elementos aparecem ao entrar na tela
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visto'); observador.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.revelar').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  observador.observe(el);
});

// Sanfona de soluções
const paineis = [...document.querySelectorAll('.painel')];
paineis.forEach(p => p.addEventListener('click', () => {
  paineis.forEach(outro => {
    const ativo = outro === p;
    outro.classList.toggle('aberto', ativo);
    outro.querySelector('.painel-rotulo').setAttribute('aria-expanded', ativo);
  });
}));

// Carrossel de depoimentos
const trilho = document.querySelector('.trilho');
const cards = [...trilho.children];
const pontos = document.getElementById('pontos');
let indice = 0;
const porVez = () => (innerWidth <= 760 ? 1 : innerWidth <= 980 ? 2 : 3);
const maximo = () => cards.length - porVez();
function desenharPontos() {
  pontos.innerHTML = '';
  for (let i = 0; i <= maximo(); i++) {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ver avaliações ${i + 1} a ${i + porVez()}`);
    b.addEventListener('click', () => irPara(i));
    pontos.appendChild(b);
  }
}
function irPara(i) {
  indice = Math.max(0, Math.min(i, maximo()));
  const passo = cards[0].getBoundingClientRect().width + 20;
  trilho.style.transform = `translateX(${-indice * passo}px)`;
  [...pontos.children].forEach((b, n) => b.setAttribute('aria-current', n === indice));
}
document.querySelectorAll('.seta').forEach(s => s.addEventListener('click', () => {
  const novo = indice + Number(s.dataset.dir);
  irPara(novo > maximo() ? 0 : novo < 0 ? maximo() : novo);
}));
let automatico = setInterval(() => irPara(indice >= maximo() ? 0 : indice + 1), 6000);
document.getElementById('carrossel').addEventListener('pointerenter', () => clearInterval(automatico));
window.addEventListener('resize', () => { desenharPontos(); irPara(indice); });
desenharPontos();
irPara(0);

// Máscara de telefone
document.querySelectorAll('[data-telefone]').forEach(input => input.addEventListener('input', () => {
  const d = input.value.replace(/\D/g, '').slice(0, 11);
  input.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
}));

// Modal do WhatsApp
const modal = document.getElementById('modalWhats');
whats.addEventListener('click', () => modal.showModal());
modal.querySelector('[data-fechar]').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

// Versão de portfólio: os formulários não enviam dados
const aviso = document.getElementById('aviso');
document.querySelectorAll('[data-form]').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  form.reset();
  if (modal.open) modal.close();
  aviso.hidden = false;
}));
aviso.querySelector('[data-fechar-aviso]').addEventListener('click', () => { aviso.hidden = true; });
