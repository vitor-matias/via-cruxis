# Via Sacra - Santidade Juvenil

Uma aplicação de Via Sacra apresentando jovens santos que nos inspiram. Esta aplicação web interativa apresenta 14 estações, cada uma dedicada à história de um jovem santo.

## Funcionalidades

- 🙏 14 Estações de jovens santos
- 🌓 Suporte a tema Escuro/Claro/Sistema
- 📖 Leitura acessível com tamanhos de fonte ajustáveis
- 🖼️ Funcionalidade de zoom de imagens
- 📱 Design responsivo para dispositivos móveis
- ♿ Desenvolvido com acessibilidade em mente

## Tecnologias

- **React 18** - Framework de interface
- **Vite** - Ferramenta de build e servidor de desenvolvimento
- **React Router** - Navegação
- **Marked** - Processamento de Markdown
- **DOMPurify** - Proteção contra XSS
- **Lucide React** - Ícones
- **ESLint** - Qualidade de código

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificar código
npm run lint

# Pré-visualizar build de produção
npm run preview

# Deploy para GitHub Pages
npm run deploy
```

## Segurança

Esta aplicação implementa várias boas práticas de segurança:
- Sanitização HTML com DOMPurify para prevenir ataques XSS
- Validação PropTypes para segurança de tipos
- Renderização segura de conteúdo
- Validação de URLs antes do processamento

## Acessibilidade

- Alternância de tema (Claro/Escuro/Sistema)
- Ajuste de tamanho de fonte (80%-150%)
- Estrutura HTML semântica
- Etiquetas ARIA para elementos interativos
- Suporte a navegação por teclado

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── StationContent.jsx
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   └── AccessibilityMenu.jsx
├── context/            # Provedores de contexto React
│   └── AccessibilityContext.jsx
├── constants.js        # Constantes da aplicação
├── App.jsx            # Componente principal da aplicação
└── main.jsx           # Ponto de entrada

public/
├── stations/          # Conteúdo Markdown para cada estação
└── images/           # Imagens dos santos
```

## Licença

Este projeto é privado e destinado a fins educacionais/religiosos.
