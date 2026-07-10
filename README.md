# 🐱 A Casa da Mãe Joana

Um jogo de plataforma e puzzle para crianças (7–10 anos), em português do
Brasil. Três gatos de verdade — **Mia**, **Zorro** e **Macchia** — precisam
atravessar a casa inteira, fase por fase, até conquistar o quintal da frente.

Sem morte, sem game over: se um humano te vir, ele só te carrega de volta
(pelo cangote!) até a última almofada-checkpoint.

**Toda a arte e todo o áudio são gerados por código** — pixel art via
canvas do Phaser e som via Web Audio API. Não há um único asset externo.

## Como rodar

Requisitos: **Node.js 20 ou mais novo** (se você usa nvm: `nvm use 20`).

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente
<http://localhost:5173>). Pronto — o jogo carrega direto no navegador.

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento (Vite) |
| `npm run build` | typecheck + build de produção em `dist/` |
| `npm run preview` | serve o build de produção |
| `npm run typecheck` | só o TypeScript (`tsc --noEmit`) |

## Controles

| Tecla | Ação |
| --- | --- |
| **Setas** ou **WASD** | andar |
| **Espaço** | pular (2x no ar = pulo duplo da Macchia) |
| **X** | habilidade principal do gato ativo |
| **C** | segunda habilidade do gato ativo |
| **1 / 2 / 3** ou **TAB** | trocar de gato (ou clique no retrato) |
| **M** | liga/desliga o som |
| **ESC** | pausa (continuar, recomeçar fase, menu) |

## Os três gatos

| Gato | Quem é | X | C |
| --- | --- | --- | --- |
| **Mia** (1) | British shorthair cinza de olhos amarelos, 12 anos, sábia e calma | **Pata de Ferro** — quebra vasos, trancas e mecanismos rachados | **Sabedoria** — pegadas douradas revelam o caminho por 4s |
| **Zorro** (2) | Frajola preto e branco, pequeno e magro, 3 anos, hiperativo (o mais rápido) | **Caçador** — dash que espanta ratos e pássaros | **Andarilho** — desliza por frestas baixas |
| **Macchia** (3) | Maine coon tricolor GRANDE, 1,5 ano, carinhosa e folgada | **Salto Alto** — pulo duplo altíssimo | **Charme** — ronrona e humanos/cachorros param 5s pro carinho |

A Macchia também é a única que **empurra caixotes e rolos** pesados (é só
andar contra eles).

Uma fase só termina quando **os três gatos** cruzam a saída — os puzzles
pedem combinações de habilidades.

## As 5 fases

1. **O Quarto** — tutorial: cada habilidade tem sua estação.
2. **O Corredor das Portas** — humanos com cone de visão, esconderijos e a
   porta de combinação (Macchia pisa no puxador ENQUANTO Mia quebra a tranca).
3. **A Sala** — verticalidade, cachorros e escadinha de caixotes.
4. **A Cozinha** — a mais difícil: a Nona (avó) imprevisível, 3 ratos e o
   puzzle do ROLLERCAT.
5. **O Quintal da Frente** — celebração ao sol com a mamãe Joana
   jardinando, e direito a soneca.

## A família da casa

Elis (7) e Elena (10) patrulham o corredor; a Nona (avó de óculos
redondos) comanda a cozinha; Joana (a mãe, de óculos de gatinho) cuida
do jardim e não pega ninguém.

O progresso das fases fica salvo no navegador (localStorage).

## Stack

- [Phaser 3.90](https://phaser.io/) (física Arcade)
- TypeScript 5 em modo strict
- Vite 6
- Zero assets externos, zero backend, zero frameworks de UI
