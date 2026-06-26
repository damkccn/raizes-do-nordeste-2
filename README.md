# Trabalho de Front-end — Sistema de Pedidos Raízes do Nordeste

Este projeto nasceu do desejo de unir a riqueza da culinária nordestina à praticidade que o dia a dia exige. O **Raízes do Nordeste** é um sistema de gerenciamento de pedidos pensado para funcionar de um jeito super versátil e acolhedor, adaptando-se ao formato que o cliente precisa no momento.

A ideia principal foi construir uma interface única que muda de comportamento dependendo da unidade selecionada. Assim, o mesmo sistema atende tanto quem está usando um **Totem de Autoatendimento** no salão físico quanto quem está em casa pedindo um **Delivery**.

---

## O que foi desenvolvido?

* **Identidade por Filial:** Logo na entrada, o usuário escolhe a unidade mais próxima (Recreio, Centro ou Campo Grande) para que sua experiência seja personalizada.
* **Cardápio Afetivo e Dinâmico:** Os pratos não são fixos. Pensando na correria de quem trabalha, a unidade do Centro, por exemplo, foca em opções mais rápidas para o almoço comercial. Alguns itens também mudam de disponibilidade para garantir o frescor dos ingredientes de cada cozinha.
* **Fluxo de Delivery Adaptativo:** Enquanto as lojas do Recreio e do Centro são voltadas para a retirada rápida no balcão, a unidade de Campo Grande funciona exclusivamente como Delivery. Quando ela é selecionada, o sistema oculta os dados de retirada e abre um formulário delicado e direto para a captura do endereço de entrega.
* **Cuidado com os Dados (LGPD):** O sistema simula um banco de dados local com muito critério. Se o usuário tentar fazer o login sem um cadastro prévio ou esquecer de marcar o consentimento da LGPD, o site bloqueia o acesso com um aviso, garantindo a proteção das informações.
* **Painel de Mimos e Recompensas (Fidelidade):** Cada pedido concluído se transforma em pontos que acumulam automaticamente. A página de fidelidade acompanha esse progresso de perto: mostra o saldo atualizado, calcula com carinho quanto falta para subir de nível (de Prata para Ouro) e libera a simulação de resgate de recompensas (como um café ou beiju grátis).
* **Rastreamento do Pedido:** Na tela final, criamos um simulador cronometrado que atualiza os status em tempo real ("Em preparo", "Saiu para entrega" ou "Pronto"), deixando o cliente bem informado sobre cada etapa do seu pedido.

---

## Tecnologias e Cuidado na Organização

Para que o site ficasse leve e rápido, optei por não usar frameworks prontos. Desenvolvi tudo usando a tríade clássica do Front-end, com bastante capricho na separação dos arquivos para deixar o código limpo e fácil de manter:

* **HTML5:** Estrutura semântica dos formulários, botões e das seções principais das páginas.
* **CSS3:** Toda a estética do projeto, com uma paleta de cores acolhedora (tons de terra, areia e ouro), layouts organizados com Grid/Flexbox e transições suaves nos modais e no carrinho lateral.
* **JavaScript (ES6):** A inteligência por trás do sistema. Cuida de toda a dinâmica de telas e usa o `localStorage` do navegador para guardar as informações de uma página para a outra (como a sessão do usuário, os itens do carrinho e o endereço digitado).

### Estrutura das pastas:

meu-projeto/
│
├── css/                  # Estilos visuais isolados com cuidado
│   ├── index.css
│   ├── cardapio.css
│   ├── pagamento.css
│   └── fidelidade.css
│
├── js/                   # Lógica e comportamento do sistema
│   ├── auth.js           # Cadastro, login e validação de privacidade
│   ├── cardapio.js       # Vitrine de produtos e controle do carrinho
│   ├── pagamento.js      # Fechamento do pedido e dados de entrega
│   └── fidelidade.js     # Soma de pontuação e resgate de brindes
│
├── index.html            # Tela de boas-vindas e acesso
├── cardapio.html         # Exibição dos pratos do dia
├── pagamento.html        # Checkout e escolha de pagamento
└── confirmacao.html      # Sucesso do pedido e rastreamento
