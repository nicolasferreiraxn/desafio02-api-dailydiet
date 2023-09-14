**RF (REQUISITOS FUNCIONAIS)**
Características do sistema que devem ser atendidas para atingir seus objetivos:

- [X] O usuário deve conseguir se registrar utilizando um e-mail e senha.
- [X] O usuário deve conseguir realizar o seu login utilizando seu e-mail e senha.
- [X] O usuário deve conseguir registrar uma refeição feita.
- [X] O usuário deve conseguir editar uma refeição.
- [X] O usuário deve conseguir apagar uma refeição.
- [X] O usuário deve conseguir visualizar uma única refeição.
- [X] O usuário deve conseguir visualizar todas as refeições.
- [X] O usuário deve conseguir visualizar suas métricas.

---

**RN (REGRA DE NEGÓCIO)**

- [X] Deve ser possível identificar o usuário entre as requisições.
- [X] A refeição inserida deve exigir os seguintes dados:
  - Nome
  - Descrição
  - Data e hora
  - Está de dieta ou não
- [X] A refeição deve ser associada ao usuário que a criou.
- [X] O usuário só pode visualizar, editar e apagar as refeições que ele mesmo cadastrou.
- [X] As métricas do usuário devem retornar os seguintes dados:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta.

---