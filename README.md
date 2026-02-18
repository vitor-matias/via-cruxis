# Via Sacra - Santidade Juvenil

Uma Via Sacra com jovens santos que nos inspiram. Esta aplicação web apresenta 14 estações, cada uma dedicada à história de um jovem santo.

## Funcionalidades

- 🙏 14 Estações de jovens santos
- 🌓 Suporte a tema Escuro/Claro/Sistema
- 📖 Leitura acessível com tamanhos de fonte ajustáveis
- 🖼️ Funcionalidade de zoom de imagens
- 📱 Design responsivo para dispositivos móveis

## Tecnologias

- **React 18** - Framework de interface
- **Vite** - Ferramenta de build e servidor de desenvolvimento
- **React Router** - Navegação
- **Marked** - Processamento de Markdown
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

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── StationContent.jsx
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   └── AccessibilityMenu.jsx
├── context/            # Contexto React
│   └── AccessibilityContext.jsx
├── constants.js        # Constantes da aplicação
├── App.jsx            # Componente principal da aplicação
└── main.jsx           # Ponto de entrada

public/
├── stations/          # Conteúdo em Markdown para cada estação
└── images/           # Imagens dos santos
```

## Licença

Este projeto é destinado a fins educacionais/religiosos.
