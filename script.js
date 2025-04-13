document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Pegando os valores dos inputs
    const tipoResidencia = document.getElementById('tipo-residencia').value;
    const areaTelhado = parseFloat(document.getElementById('area-telhado').value);
    const consumo = parseFloat(document.getElementById('consumo').value);
    const horasSolares = parseFloat(document.getElementById('horas-solares').value);
    const preco = parseFloat(document.getElementById('preco').value);
    const percentualEconomia = parseFloat(document.getElementById('percentual-economia').value);

    // Validando os valores
    if (isNaN(consumo) || consumo <= 0 || isNaN(horasSolares) || horasSolares <= 0 || isNaN(percentualEconomia) || percentualEconomia <= 0 || percentualEconomia > 100) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    // Calculando a quantidade de energia necessária (em kWh)
    const energiaNecessaria = consumo * (percentualEconomia / 100);

    // Considerando um painel solar de 300W e eficiência de 18% (valores típicos)
    const potenciaPainel = 300;  // Potência do painel em W
    const eficienciaPainel = 0.18;  // Eficiência média de painéis solares

    // Calculando a quantidade de energia que cada painel pode gerar por dia
    const energiaDiariaPorPainel = (potenciaPainel * eficienciaPainel * horasSolares) / 1000;  // Energia em kWh/dia

    // Calculando a quantidade de painéis necessários
    const quantidadePainel = Math.ceil(energiaNecessaria / energiaDiariaPorPainel);  // Arredondando para cima

    // Calculando o espaço necessário para os painéis (considerando que cada painel precisa de 1,5m²)
    const espacoNecessario = quantidadePainel * 1.5; // m²

    // Calculando o custo total (considerando o custo médio do painel solar)
    const custoPainel = 1500;  // Custo de cada painel em R$
    const custoTotal = quantidadePainel * custoPainel;

    // Exibindo os resultados
    document.getElementById('resultados').innerHTML = `
        <div class="result-item">
            <p><strong>Tipo de Painel:</strong> Painel de 300W, 18% de eficiência (típico).</p>
        </div>
        <div class="result-item">
            <p><strong>Quantidade de Painéis Necessários:</strong> ${quantidadePainel} painéis.</p>
        </div>
        <div class="result-item">
            <p><strong>Espaço Necessário (m²):</strong> ${espacoNecessario.toFixed(2)} m².</p>
        </div>
        <div class="result-item">
            <p><strong>Custo Total Estimado (R$):</strong> R$ ${custoTotal.toFixed(2)}.</p>
        </div>
    `;
});
