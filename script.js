document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEndereco');
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const numeroInput = document.getElementById('numero');
    const ufInput = document.getElementById('uf');

    // --- Funções de Validação ---

    // Critério de Aceite: O campo CEP é formatado automaticamente.
    function formatarCEP(valor) {
        // Remove tudo que não for dígito
        valor = valor.replace(/\D/g, '');
        // Aplica a máscara 00000-000
        if (valor.length > 5) {
            valor = valor.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
        }
        return valor;
    }

    function validarCEP(cep) {
        // Remove a máscara para validação de conteúdo (8 dígitos)
        const apenasDigitos = cep.replace(/\D/g, '');
        if (apenasDigitos.length !== 8) {
            return { valido: false, mensagem: "CEP: O campo deve conter 8 dígitos." };
        }
        // Requisito: Validar usando regex com grupos de captura.
        // Valida o formato final (00000-000)
        const regex = /^(\d{5})-(\d{3})$/; 
        if (!regex.test(cep)) {
             // Este caso deve ser raro devido à máscara, mas garante a validação final.
             return { valido: false, mensagem: "CEP: Formato inválido. Use 00000-000." };
        }
        return { valido: true };
    }

    function validarLogradouro(logradouro) {
        // Requisito: Deve conter no mínimo 5 caracteres.
        if (logradouro.trim().length < 5) {
            return { valido: false, mensagem: "Logradouro: Deve conter no mínimo 5 caracteres." };
        }
        return { valido: true };
    }

    function validarNumero(numero) {
        // Requisito: Deve permitir apenas dígitos numéricos.
        const regex = /^\d+$/;
        if (!regex.test(numero.trim()) || numero.trim() === '') {
            return { valido: false, mensagem: "Número: Deve conter apenas dígitos numéricos e ser preenchido." };
        }
        return { valido: true };
    }

    function validarUF(uf) {
        // Requisito: Deve aceitar somente 2 letras maiúsculas. Validar usando regex.
        const regex = /^[A-Z]{2}$/;
        if (!regex.test(uf)) {
            return { valido: false, mensagem: "UF: Deve conter exatamente 2 letras maiúsculas (Ex: SP, RJ)." };
        }
        return { valido: true };
    }

    // --- Regras de Comportamento (Eventos) ---

    // Regra: O campo CEP deve ser formatado automaticamente enquanto o usuário digita.
    cepInput.addEventListener('input', (event) => {
        event.target.value = formatarCEP(event.target.value);
    });

    // Regra e Critério de Aceite: O campo UF deve ser convertido para maiúsculo automaticamente durante a digitação.
    ufInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.toUpperCase();
    });

    // Regra: O envio do formulário deve ser controlado com addEventListener("submit", ...) preventDefault()
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Limpa possíveis alertas anteriores
        const campos = [
            { id: 'cep', validador: validarCEP, valor: cepInput.value },
            { id: 'logradouro', validador: validarLogradouro, valor: logradouroInput.value },
            { id: 'numero', validador: validarNumero, valor: numeroInput.value },
            { id: 'uf', validador: validarUF, valor: ufInput.value },
        ];

        let formularioValido = true;
        
        // A validação para e exibe o alerta no primeiro erro, conforme a regra.
        for (const campo of campos) {
            // Critério de Aceite: Campos obrigatórios não podem ser enviados em branco.
            if (campo.valor.trim() === '') {
                 alert(`${campo.id.toUpperCase()}: Campo obrigatório não pode estar em branco.`);
                 formularioValido = false;
                 document.getElementById(campo.id).focus();
                 return; // Para a submissão e o loop
            }

            const resultado = campo.validador(campo.valor);
            if (!resultado.valido) {
                // Regra: Cada campo inválido deve gerar um alert com a mensagem de erro apropriada.
                alert(resultado.mensagem);
                formularioValido = false;
                document.getElementById(campo.id).focus();
                return; // Para a submissão e o loop
            }
        }

        // Critério de Aceite: O alerta “Endereço cadastrado com sucesso” aparece quando o formulário é válido.
        if (formularioValido) {
            alert("Endereço cadastrado com sucesso");
            form.reset(); // Limpa o formulário após o sucesso
        }
    });
});