let somAtivo = true;

const sons = {
  clique: new Audio('assets/efeito-clique.mp3'),
  vitoria: new Audio('assets/efeito-vitoria.mp3'),
  falha: new Audio('assets/efeito-falha.mp3'),
  aplausos: new Audio('assets/efeito-aplausos.mp3'),
  corrida: new Audio('assets/musica-corrida.mp3'),
  salto_distancia: new Audio('assets/musica-salto-distancia.mp3'),
  salto_altura: new Audio('assets/musica-salto-altura.mp3')
};

Object.values(sons).forEach(s => { s.volume = 0.4; s.loop = true; });

function tocarSom(tipo) {
  if (somAtivo && sons[tipo]) {
    sons[tipo].currentTime = 0;
    sons[tipo].play();
  }
}

function pararTodasMusicas() {
  Object.values(sons).forEach(s => s.pause());
}

function alternarSom() {
  somAtivo = !somAtivo;
  const botao = document.getElementById('botaoSom');
  botao.textContent = somAtivo ? '🔊 Som Ligado' : '🔇 Som Desligado';
  if (!somAtivo) {
    pararTodasMusicas();
  }
}

function iniciarJogo(modalidade) {
  alert(`Modo ${modalidade} iniciado!`);
  const canvas = document.getElementById('canvasJogo');
  canvas.classList.remove('oculto');

  // Sons
  pararTodasMusicas();
  tocarSom(modalidade);
  tocarSom('aplausos');

  // Canvas simples
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00f';
  ctx.fillRect(50, 200, 50, 50);
}

function salvarPersonalizacao() {
  const nome = document.getElementById('nomeAtleta').value;
  alert(`Atleta ${nome} personalizado!`);
  tocarSom('clique');
}

function carregarRanking() {
  const lista = document.getElementById('listaRanking');
  const dadosRanking = [
    { nome: 'Lucas', modalidade: 'Corrida', recorde: '9.58s' },
    { nome: 'Ana', modalidade: 'Salto Distância', recorde: '8.90m' },
    { nome: 'Rafa', modalidade: 'Salto Altura', recorde: '2.45m' }
  ];

  lista.innerHTML = '';
  dadosRanking.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.modalidade} - ${item.recorde}`;
    lista.appendChild(li);
  });
}

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
  tocarSom('clique');
}

document.addEventListener('DOMContentLoaded', carregarRanking);


const musica = document.getElementById('musicaFundo');
const efeitoClique = document.getElementById('efeitoClique');

// Iniciar som manualmente (evita bloqueio do navegador)
document.addEventListener('click', () => {
  if (musica.paused) {
    musica.volume = 0.3; // volume de fundo suave
    musica.play();
  }
});

// Usar efeito de clique nos botões
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    efeitoClique.currentTime = 0;
    efeitoClique.play();
  });
});


let atleta = {
  nome: 'Desconhecido',
  forca: 50,
  resistencia: 50,
  velocidade: 50
};

let jogoAtivo = false;
let posicao = 0;
let velocidadeAtual = 0;

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');

  if (id === 'ranking') carregarRanking();
}

function salvarPersonalizacao() {
  atleta.nome = document.getElementById('nomeAtleta').value || 'Desconhecido';
  atleta.forca = document.querySelectorAll('input[type="range"]')[0].value;
  atleta.resistencia = document.querySelectorAll('input[type="range"]')[1].value;
  atleta.velocidade = document.querySelectorAll('input[type="range"]')[2].value;

  localStorage.setItem('atleta', JSON.stringify(atleta));
  alert(`Atleta ${atleta.nome} salvo com sucesso!`);
  document.getElementById('statusNome').textContent = nome;
  document.getElementById('statusForca').textContent = document.querySelectorAll('input[type=range]')[0].value;
  document.getElementById('statusResistencia').textContent = document.querySelectorAll('input[type=range]')[1].value;
  document.getElementById('statusVelocidade').textContent = document.querySelectorAll('input[type=range]')[2].value;

  document.getElementById('painelStatus').classList.remove('oculto');
}

function iniciarJogo(modalidade) {
  const canvas = document.getElementById('canvasJogo');
  const painel = document.getElementById('painelAtleta');
  canvas.classList.remove('oculto');
  painel.classList.remove('oculto');
  mostrarTela('canvasJogo');

  atleta = JSON.parse(localStorage.getItem('atleta')) || atleta;

  // Resetando estado
  posicao = 0;
  jogoAtivo = true;
  velocidadeAtual = parseInt(atleta.velocidade) / 2;

  atualizarPainel();
  desenharCena();

  alert(`Iniciando ${modalidade} com ${atleta.nome}! Pressione espaço para correr.`);

  // Controle de corrida
  document.addEventListener('keydown', correr);
}

function desenharCena() {
  const canvas = document.getElementById('canvasJogo');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 200;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Pista
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 150, canvas.width, 50);

  // Atleta
  ctx.fillStyle = "#00f";
  ctx.fillRect(posicao, 130, 30, 30);

  if (posicao >= canvas.width - 30) {
    jogoAtivo = false;
    document.removeEventListener('keydown', correr);
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Chegada!", 250, 100);
    salvarNoRanking(atleta.nome, 'Corrida', 'Venceu!');
  }

  if (jogoAtivo) requestAnimationFrame(desenharCena);
}

function correr(e) {
  if (e.code === 'Space' && jogoAtivo) {
    posicao += velocidadeAtual;
    velocidadeAtual -= 0.1; // Fadiga

    if (velocidadeAtual <= 1) {
      velocidadeAtual = parseInt(atleta.velocidade) / 2; // Recupera um pouco
    }

    atualizarPainel();
  }
}

function atualizarPainel() {
  document.getElementById('statusNome').textContent = atleta.nome;
  document.getElementById('statusVelocidade').textContent = atleta.velocidade;
  document.getElementById('statusForca').textContent = atleta.forca;
  document.getElementById('statusResistencia').textContent = atleta.resistencia;
}

function salvarNoRanking(nome, modalidade, recorde) {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.push({ nome, modalidade, recorde });
  localStorage.setItem('ranking', JSON.stringify(ranking));
}

function carregarRanking() {
  const lista = document.getElementById('listaRanking');
  const dadosRanking = JSON.parse(localStorage.getItem('ranking')) || [];

  lista.innerHTML = '';
  dadosRanking.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.modalidade} - ${item.recorde}`;
    lista.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const dados = localStorage.getItem('atleta');
  if (dados) atleta = JSON.parse(dados);
  carregarRanking();
});
function desenharCenarioCorrida(ctx) {
  // Céu
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, 600, 100);

  // Arquibancada
  ctx.fillStyle = '#CCCCCC';
  ctx.fillRect(0, 100, 600, 50);

  // Público (círculos coloridos)
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
    ctx.arc(Math.random() * 600, 100 + Math.random() * 50, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pista
  ctx.fillStyle = '#A52A2A';
  ctx.fillRect(0, 150, 600, 150);

  // Faixas
  ctx.strokeStyle = 'white';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 150 + i * 25);
    ctx.lineTo(600, 150 + i * 25);
    ctx.stroke();
  }

  // Atleta
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(50, 200, 30, 30);
}

function iniciarJogo(modalidade) {
  alert(`Modo ${modalidade} iniciado!`);
  const canvas = document.getElementById('canvasJogo');
  canvas.classList.remove('oculto');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pararTodasMusicas();
  tocarSom(modalidade);
  tocarSom('aplausos');

  switch (modalidade) {
    case 'corrida':
      desenharCenarioCorrida(ctx);
      break;
    case 'salto_distancia':
      desenharCenarioSaltoDistancia(ctx);
      break;
    case 'salto_altura':
      desenharCenarioSaltoAltura(ctx);
      break;
  }
}

function desenharCenarioSaltoDistancia(ctx) {
  ctx.fillStyle = '#87CEEB'; // Céu
  ctx.fillRect(0, 0, 600, 100);

  ctx.fillStyle = '#CCCCCC'; // Arquibancadas
  ctx.fillRect(0, 100, 600, 50);

  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
    ctx.arc(Math.random() * 600, 100 + Math.random() * 50, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#A52A2A'; // Pista de corrida até a areia
  ctx.fillRect(0, 150, 400, 150);

  ctx.fillStyle = '#FFD700'; // Caixa de areia
  ctx.fillRect(400, 150, 200, 150);

  ctx.fillStyle = '#228B22'; // Atleta
  ctx.fillRect(50, 200, 30, 30);
}

function desenharCenarioSaltoAltura(ctx) {
  ctx.fillStyle = '#87CEEB'; // Céu
  ctx.fillRect(0, 0, 600, 100);

  ctx.fillStyle = '#CCCCCC'; // Arquibancadas
  ctx.fillRect(0, 100, 600, 50);

  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
    ctx.arc(Math.random() * 600, 100 + Math.random() * 50, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#228B22'; // Grama
  ctx.fillRect(0, 150, 600, 150);

  ctx.fillStyle = '#8B0000'; // Colchão de salto
  ctx.fillRect(450, 200, 80, 40);

  ctx.strokeStyle = '#000'; // Barra de salto
  ctx.beginPath();
  ctx.moveTo(460, 170);
  ctx.lineTo(520, 170);
  ctx.stroke();

  ctx.fillStyle = '#FF4500'; // Atleta
  ctx.fillRect(100, 200, 30, 30);
}