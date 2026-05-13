# 🚀 Broadcast SaaS

Sistema especializado em agendamento de mensagens e gestão de campanhas, desenvolvido para oferecer uma experiência Premium e Mobile-First.

## 🛠️ Tecnologias

Frontend: React + TypeScript.

Estilização: Tailwind CSS + Material UI (MUI).

Backend & Auth: Firebase (Firestore, Auth, Functions).

Deploy: Firebase Hosting.

## ✨ Funcionalidades

Autenticação: Login e Cadastro com Firebase Auth.

Conexões: Gestão de instâncias e provedores de mensagens.

Contatos: Diretório com busca em tempo real e filtros por conexão.

Broadcast: Agendamento de mensagens com suporte a múltiplos destinatários.

Histórico: Visualização por abas (Tudo, Agendadas e Enviadas).

## 🚀 Como rodar o projeto

1. **Instale as dependências:**

```Bash
  cd web && npm install
```

2. **Configure o Firebase:**
   Crie um arquivo .env na pasta web com suas chaves do Firebase.

3. **Inicie o ambiente de desenvolvimento:**

```Bash
  npm run dev
```

4. **Build para Produção:**

```Bash
  npm run build
```

## 🌐 Deploy

O projeto está configurado com GitHub Actions para deploy automático no Firebase Hosting ao realizar push na branch main.
