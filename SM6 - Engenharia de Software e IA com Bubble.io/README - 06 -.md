# 🫧 Desenvolvimento No-Code com IA: Gestão e Governança no Bubble.io

## 📝 Descrição do Projeto
O objetivo deste projeto foi desenvolver uma aplicação web de gestão utilizando a IA do Bubble como acelerador, aplicando rigorosamente fundamentos de **Engenharia de Software** para garantir segurança, escalabilidade e governança. O foco principal foi entender que a IA gera apenas um "rascunho", e a atuação humana é indispensável para refatorar a lógica e proteger os dados.

## 🚀 Metodologia Aplicada
A construção seguiu um protocolo de 8 passos focado em boas práticas profissionais:
* **Arquitetura de Dados:** Mapeamento de Entidades (Data Types) e Otimização de Relações antes da criação de telas.
* **Option Sets:** Implementação de conjuntos de opções para evitar *hardcoding* (textos soltos) nas lógicas do sistema.
* **Privacy by Design:** Configuração de regras de privacidade estritas (`This Data's Creator is Current User`) para evitar o vazamento de dados entre usuários.
* **Governança:** Organização de Workflows por cores e documentação in-platform através de Notas.

---

## 🛠️ Tecnologias e Ferramentas
* **Plataforma:** [Bubble.io](https://bubble.io/)
* **Acelerador:** Bubble AI (Geração de Blueprints).
* **Segurança:** Regras de Privacidade e Proteção contra vulnerabilidades OWASP.
* **Otimização:** Monitoramento de Workload Units (WUs) para controle de custos de infraestrutura.

---

## 📊 Estratégia de Saída (Vendor Lock-in)
Como o Bubble retém a posse do código-fonte, a mitigação do risco de *Vendor Lock-in* foi planejada através da habilitação da **Data API**. Isso permite a extração de tabelas via JSON, facilitando uma eventual migração para tecnologias tradicionais como React e Node.js no futuro.

---

## 📂 Conteúdo da Entrega
* **Link do Aplicativo:** [Insira o link da sua version-test aqui]
* **Rascunho do Banco:** Print/Link da modelagem de dados e Option Sets.
* **Evidências de Segurança:** Prints das abas Data > Privacy e Workflows organizados.
* **Estratégia de Saída:** Documento detalhando a extração de dados via API.

---
[Voltar ao início](../README.md)