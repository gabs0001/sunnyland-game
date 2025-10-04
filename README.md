## 🏞️ Sunnyland Game: Aventura e Pixel Art Dinâmico

Um jogo de plataforma 2D com *scrolling* de câmera e mecânicas de *gameplay* clássicas (corrida, pulo, coleta e combate simples). Desenvolvido do zero usando **JavaScript puro** e **HTML5 Canvas**.

O projeto teve como base um treinamento no **YouTube**, mas foi significativamente aprimorado em termos de **arquitetura de código**, **performance de renderização** e **ajustes finos de *gameplay***.

-----

## ✨ Destaques Técnicos e Funcionalidades

Este projeto é uma demonstração de habilidades em arquitetura de jogos 2D e depuração de problemas complexos de renderização e colisão.

  * **Arquitetura Orientada a Objetos (POO):** O código é modularizado com classes (`Player`, `Sprite`, `CollisionBlock`, etc.) para gerenciar o estado e o comportamento das entidades de forma limpa e manutenível.
  * **Engine de Plataforma Customizada:** Implementação manual de:
      * **Gravidade** e **Movimento *Time-Based*** (`deltaTime`) para garantir *gameplay* consistente em diferentes taxas de *frames*.
      * **Detecção de Colisão AABB (Axis-Aligned Bounding Box)** precisa para colisões com o mapa e com inimigos.
  * **Renderização Otimizada de Mapa:** Utiliza o **HTML5 Canvas Offscreen** para pré-renderizar o mapa completo do jogo (criado no **Tiled**), garantindo alta *performance* ao desenhar grandes níveis a cada *frame*.
  * **Câmera Dinâmica (Viewport):** Simulação de uma câmera que acompanha o *player*, movendo o *mundo* e aplicando **Efeito Parallax** em camadas de *background* para dar profundidade à cena.
  * **Animação de Sprites Fluida:** Gerenciamento de múltiplos estados de animação (Idle, Run, Jump, Fall) com *timing* e transição suaves.

-----

## 🛠️ Desafios e Correções de Bugs (Refatoração de Qualidade)

Um foco principal deste projeto foi a **depuração e correção de *bugs*** complexos de *engine*:

  * **Correção de Artefatos Visuais e *Screen Tearing***: Solução do *bug* de rastros e fragmentação na tela, ajustando a ordem de **limpeza do Canvas** (`clearRect`) e as **transformações de câmera** (`translate`).
  * **Ajuste de Escala e Limites do Mapa:** Correção do problema de *zoom* excessivo e de mapas que "terminavam" abruptamente, garantindo que o **Canvas Offscreen** fosse dimensionado exatamente para o tamanho real do mundo do Tiled.

-----

## 💻 Tecnologias Utilizadas

  * **HTML5 Canvas**
  * **JavaScript (Puro)** (Lógica da Engine e POO)
  * **CSS3**
  * **Tiled** (Ferramenta de Criação de Mapas)

-----

## 🕹️ Controles

| Ação | Tecla |
| :--- | :--- |
| Mover Esquerda | **A** |
| Mover Direita | **D** |
| Pular | **W** |
