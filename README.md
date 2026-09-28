# Portfólio de Mickeias Charles

Portfólio desenvolvido em Angular, com conteúdo em português e inglês. A versão pública está em [mickeiascharles.github.io/portfolio](https://mickeiascharles.github.io/portfolio/).

## Executar localmente

```bash
npm install
npm start -- --serve-path /portfolio
```

Abra `http://localhost:4200/portfolio/`. Para conferir o build de produção, execute `npm run build`.

## Organização

- `src/app/services/language.ts`: textos, projetos, badges e documentos das duas versões do site.
- `src/app/components/album/`: galeria, navegação e lista das fotos.
- `src/app/components/sobre/`: apresentação, tecnologias e contatos.
- `src/app/app.*`: moldura, navegação geral e animação de abertura.
- `public/assets/`: imagens, ícones, áudio e currículos servidos pelo site.

## Publicar no GitHub Pages

O código-fonte fica na branch `main`. A branch `gh-pages` recebe o build gerado por:

```bash
npm run ng -- deploy --base-href=/portfolio/
```
