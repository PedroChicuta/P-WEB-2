# Sistema de Gerenciamento de Cursos e Matrículas

Este projeto é uma aplicação web desenvolvida para o gerenciamento acadêmico, permitindo o controle de alunos, cursos e o vínculo entre eles (matrículas). O sistema foi construído utilizando Node.js e segue uma arquitetura em camadas visando desacoplamento e facilidade de manutenção.

## Tecnologias Utilizadas

* **Linguagem:** JavaScript (Node.js)
* **Framework Web:** Express.js
* **Banco de Dados:** MySQL
* **ORM:** Sequelize
* **View Engine:** EJS (Embedded JavaScript)
* **Estilização:** CSS (Customizado)
* **Validação:** Express-Validator

## Arquitetura do Projeto

O projeto segue padrões de arquitetura limpa e MVC, organizado da seguinte forma:

* **Controller:** Responsável por receber as requisições HTTP, validar dados e chamar os serviços.
* **Service (Application Layer):** Contém as regras de negócio da aplicação.
* **Repository (Infrastructure Layer):** Abstrai a comunicação com o banco de dados (Sequelize).
* **Model:** Definição das tabelas e tipos de dados do banco.
* **Container:** Gerencia a injeção de dependências, instanciando repositórios e serviços e passando-os para os controladores.

## Funcionalidades

### 1. Módulo de Alunos
* **Listagem:** Exibição de todos os alunos com opção de busca por nome.
* **Cadastro/Edição:** Formulário para inserir nome, email e matrícula.
* **Validação:** Verificação de campos obrigatórios e formatos de email.
* **Exclusão:** Remoção de alunos do banco de dados.

### 2. Módulo de Cursos
* **Gerenciamento:** Criação, edição e remoção de cursos.
* **Controle de Status:** Funcionalidade de "Ativar/Desativar" curso diretamente na lista.
* **Validação Numérica:** O campo de Carga Horária aceita apenas números inteiros.
* **Regra de Negócio:** Apenas cursos com status "Ativo" aparecem disponíveis para novas matrículas.

### 3. Módulo de Matrículas
* **Vínculo:** Associa um Aluno a um Curso.
* **Visualização:** Listagem completa exibindo o nome do Aluno e do Curso (via Join no banco de dados).
* **Filtros:** Possibilidade de filtrar matrículas por status (Ativa, Trancada, Concluída).
* **Ciclo de Vida:**
    * **Ativa:** Status inicial padrão.
    * **Trancada:** Permite trancar a matrícula (impede conclusão).
    * **Concluída:** Marca o curso como finalizado pelo aluno.
* **Integridade:** O sistema impede a matrícula em cursos inativos.

## Pré-requisitos

Para rodar este projeto localmente, você precisará de:

* Node.js instalado.
* MySQL Server instalado e rodando.

## Instalação e Configuração

1.  **Clonar o repositório:**
    Baixe o código fonte para sua máquina local.

2.  **Instalar dependências:**
    No terminal, dentro da pasta do projeto, execute:
    ```bash
    npm install
    ```

3.  **Configurar o Banco de Dados:**
    Crie um banco de dados no seu MySQL (exemplo: `sistema_escolar`).

4.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto e preencha com suas credenciais do MySQL:

    ```ini
    DB_NAME=sistema_escolar
    DB_USER=root
    DB_PASSWORD=sua_senha_aqui
    DB_HOST=localhost
    DB_PORT=3306
    DB_DIALECT=mysql
    ```

5.  **Inicializar o Sistema:**
    Execute o comando para iniciar o servidor:
    ```bash
    npm start
    ```
    *Nota: Na primeira execução, o Sequelize sincronizará os Modelos e criará as tabelas automaticamente no banco de dados.*

6.  **Acesso:**
    Abra o navegador e acesse: `http://localhost:3000`

## Estrutura de Pastas

* `/application`: Serviços (Services).
* `/controllers`: Controladores das rotas.
* `/container`: Configuração de injeção de dependência.
* `/domain`: Entidades e Interfaces (Ports).
* `/infra`: Configuração de Banco de Dados, Models e Repositories.
* `/public`: Arquivos estáticos (CSS, Imagens).
* `/routes`: Definição das rotas (endpoints).
* `/views`: Arquivos EJS (Frontend).

## Autores
Alunos: Luiz Claudio e Pedro
Desenvolvido como atividade prática para a disciplina de Programação Web II.