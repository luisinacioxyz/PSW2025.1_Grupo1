# CourseRank - A Plataforma Definitiva de Avaliação de Cursos Online

![CourseRank Logo](https://via.placeholder.com/150) <!-- Placeholder for logo -->

**Compare, avalie e descubra os melhores cursos online antes de investir seu tempo e dinheiro.**

## Visão Geral

O **CourseRank** é uma plataforma web que permite aos usuários comparar, avaliar e descobrir cursos online de diversas plataformas (como Udemy, Coursera, Alura, Domestika, etc.), ajudando-os a escolher a melhor opção com base em experiências reais de outros usuários. A ideia é funcionar como um **TripAdvisor/LetterBox dos cursos online**, permitindo que usuários encontrem cursos de alta qualidade e evitem experiências ruins.

---

## Declaração de Propósito

### Nome do Sistema e Propósito
- **Nome**: CourseRank  
- **Propósito**: Permitir que usuários comparem e avaliem cursos online de diferentes plataformas, ajudando-os a tomar decisões informadas com base na qualidade e experiências de outros usuários.

### Business Case Simplificado
- **Contexto**: Durante a pandemia de COVID-19, o mercado de cursos online cresceu significativamente, mas muitos usuários enfrentaram dificuldades para encontrar cursos de qualidade a preços acessíveis. O CourseRank resolve esse problema ao centralizar informações de cursos e avaliações permitindo comparações econômicas e ajudando os usuários a economizar tempo.
- **Como Gera Valor**: O sistema facilita a integração de uma comunidade auto-gerenciada pelos usuários. Dessa forma, inserindo um usuário em um ecossistema que facilita a escolha do curso ideal com base nas informações fornecidas.

### Processo de Negócio Principal
O processo principal do CourseRank envolve os seguintes passos:
1. O usuário escolhe o curso que está realizando.
2. O usuário insere a data de início e término do curso.
3. Caso a data de término seja menor do que hoje, ele pode avaliar o curso

### Casos de Uso
Os casos de uso do CourseRank são:
- **Manutenção de Cupons** (4 casos de uso - CRUD: Create, Read, Update, Delete): Gerenciar os cupons que o usuário tem acesso.
- **Manutenção de Cursos** (4 casos de uso - CRUD): Gerenciar os cursos (itens) que o usuário deseja adicionar.
- **Manutenção de Avaliação** (4 casos de uso - CRUD): Gerenciar informações sobre as avaliações de cursos.


### Entidades de Domínio
As entidades principais do CourseRank são:
- **Curso**: Representa os cursos online (ex.: "Curso de Python na Udemy").
- **Usuário**: Representa o usuário.
- **Avaliação**: Representa a avaliação de um curso em uma plataforma específica.
- **Plataforma**: Representa as plataformas de cursos (ex.: Udemy, Coursera).

---

## Matriz CRUD

| Funcionalidade              | Curso | Cupom | Avaliação | Plataforma |
|-----------------------------|-------|-------|-----------|------------|
| **Manutenção de Cursos**    | CRUD  | -     | -         | -          |
| **Manutenção de Cupons**    | R     | CRUD  | -         | -          |
| **Manutenção de Avaliação** | R     | -     | CRUD      | R          |

### Explicação da Matriz CRUD
- **Manutenção de Cursos**: Gerencia os cursos, afetando diretamente a entidade **Curso** com CRUD.
- **Manutenção de Cupons**: Gerencia os cupons, afetando a entidade **Cupom** com CRUD, e lê informações dos **Cursos** (R) para associar cupons.
- **Manutenção de Avaliação**: Gerencia as avaliações, afetando a entidade **Avaliação** com CRUD, e lê informações dos **Cursos** (R) e **Plataformas** (R) para contextualizar as avaliações.

---
## Matriz Perfil x Funcionalidade (Revisada)

| Funcionalidade              | Usuário Consumidor | Administrador |
|-----------------------------|--------------------|--------------|
| **Manutenção de Cursos**    | X              |  X             |
| **Manutenção de Cupons**    | -               |  X             |
| **Manutenção de Avaliação** | X                  | X             |

### Explicação da Matriz Perfil x Funcionalidade
- **Manutenção de Cursos**: O **Usuário Consumidor** adiciona e gerencia cursos, e o **Administrador** tem acesso para supervisão. 
- **Manutenção de Cupons**: O **Usuário Consumidor** gerencia seus cupons, e o **Administrador** tem acesso para suporte.
- **Manutenção de Avaliação**: O **Usuário Consumidor** cria e visualiza avaliações, e o **Administrador** tem acesso total para gerenciamento e suporte.

---
---

## Protótipos de Tela


- [Protótipos](https://www.canva.com/design/DAGijdLY7Rc/zuSSZ70QoYbvX1scLp7ymA/view?utm_content=DAGijdLY7Rc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2772b77a80)


