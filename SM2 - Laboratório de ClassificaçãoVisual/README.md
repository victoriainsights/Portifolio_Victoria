# ⚖️ Laboratório de Classificação Visual e Ética em IA

## 📝 Descrição do Projeto
Este projeto consiste em um experimento prático focado na identificação e análise de vieses em modelos de aprendizado de máquina, realizado como parte da disciplina de Inteligência Artificial. O objetivo principal é demonstrar como a curadoria de dados enviesada corrompe a lógica de classificação, utilizando a ferramenta Teachable Machine para criar um modelo que distingue entre "Perfil Liderança" e "Perfil Operacional".

A metodologia envolve a alimentação deliberada do algoritmo com estereótipos (ex: homens de terno para liderança e roupas informais para o operacional) para registrar falhas de inferência e analisar os impactos éticos dessas classificações automatizadas.

![Registro do erro de classificação devido ao viés dos dados de treinamento]
Figura 1: Evidência visual do modelo apresentando falha de classificação.

## 🚀 Tecnologias Utilizadas
* **Plataforma:** Teachable Machine (Google).
* **Dataset:** Imagens capturadas via webcam ou carregadas deliberadamente com critérios estereotipados.
* **Foco Técnico:** Classificação binária de imagens e análise de falsos positivos/negativos.

## 📊 Memorial de Impacto e Ética
A análise abaixo utiliza obrigatoriamente verbos no presente do indicativo para descrever o funcionamento e as consequências do sistema desenvolvido.

* **Mecanismo do Viés:** O mecanismo se **corrompe** quando o algoritmo **identifica** algo e **percebe** a presença de duas vertentes no mesmo lugar, o que **causa** um conflito direto de regras. A seleção restrita de dados **gera** esse erro sistêmico, como no caso de uma pessoa que **utiliza** óculos.
* **Consequência Social:** O sistema **identifica** um elemento e, ao analisar com base em regras rígidas, **declara** o indivíduo como um objeto por focar primeiro no que **está** em destaque visual. Esse processo **marginaliza** o ser humano, como ocorre quando uma mulher **é** escaneada e **declarada** como objeto pelo modelo.
* **Ação Mitigadora:** A intervenção **considera** mais uma vertente da pessoa integrada ao objeto e **adiciona** uma margem maior para a aplicação da regra. Essa mudança **identifica** com maior precisão o que **é** e o que não **é** um objeto, garantindo a equidade para pessoas
