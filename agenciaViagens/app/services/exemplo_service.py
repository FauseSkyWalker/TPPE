class ExemploService:
    def hello_world(self):
        return "Hello, World!"

    def saudacao(self, nome: str):
        if not nome:
            raise ValueError("Nome não pode ser vazio.")
        return f"Olá, {nome}!"

    def salvar_no_banco(self, repo, nome: str):
        if not nome:
            raise ValueError("Nome inválido")
        return repo.salvar(nome)
