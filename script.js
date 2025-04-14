document.addEventListener('DOMContentLoaded', function () {
    // Função para atualizar a tarifa e fornecedor
    function atualizarTarifa() {
        const estado = document.getElementById('estado').value;
        const cidade = document.getElementById('cidade').value;
    
        if (!cidade) {
            document.getElementById('fornecedor').value = '';
            document.getElementById('preco').value = '';
            return;
        }
    
        const chave = `${estado}-${cidade}`;
        const tarifasPorCidade = {
            "SP-Cerquilho": {
                fornecedor: "Elektro Eletricidade e Serviços S/A",
                tarifa: 0.87
            },
            "SP-Iperó": {
                fornecedor: "CPFL Piratininga",
                tarifa: 0.94
            },
            "SP-Sorocaba": {
                fornecedor: "CPFL Piratininga",
                tarifa: 0.94
            }
        };
    
        const dados = tarifasPorCidade[chave];
    
        if (dados) {
            document.getElementById('fornecedor').value = dados.fornecedor;
            document.getElementById('preco').value = dados.tarifa;
        } else {
            document.getElementById('fornecedor').value = '';
            document.getElementById('preco').value = '';
        }
    }

    // Atualiza a tarifa quando o estado ou cidade for alterado
    document.getElementById('estado').addEventListener('change', atualizarTarifa);
    document.getElementById('cidade').addEventListener('change', atualizarTarifa);

    // Calculando os resultados quando o formulário for enviado
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        const consumo = parseFloat(document.getElementById('consumo').value);
        const preco = parseFloat(document.getElementById('preco').value);
        const percentualEconomia = parseFloat(document.getElementById('percentual-economia').value);

        const irradiacaoMedia = 4.5; // Média diária de sol em horas em SP
        const potenciaPainel = 0.3; // 300W (0.3 kW)
        const custoPainel = 1500; // Valor estimado por painel em R$

        if (isNaN(consumo) || consumo <= 0 || isNaN(percentualEconomia) || percentualEconomia <= 0 || percentualEconomia > 100) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        // Quantidade de energia que o usuário quer compensar (em kWh)
        const energiaNecessaria = consumo * (percentualEconomia / 100);

        // Energia diária gerada por painel de 300W (em kWh)
        const energiaDiariaPorPainel = potenciaPainel * irradiacaoMedia;

        // Energia mensal por painel (considerando 30 dias)
        const energiaMensalPorPainel = energiaDiariaPorPainel * 30;

        // Número de painéis necessários
        const quantidadePainel = Math.ceil(energiaNecessaria / energiaMensalPorPainel);

        // Espaço necessário considerando 1,5 m² por painel
        const espacoNecessario = quantidadePainel * 1.5;

        // Custo total estimado
        const custoTotal = quantidadePainel * custoPainel;

        // Sistema indicado
        const potenciaTotal = quantidadePainel * potenciaPainel; // Potência total instalada em kW
        const geracaoMensal = energiaMensalPorPainel * quantidadePainel; // Geração mensal total em kWh

        // Informações sobre investimento
        const economiaMensal = energiaNecessaria * preco; // economia mensal com a compensação
        const economiaAnual = economiaMensal * 12;
        const payback = custoTotal / economiaAnual; // tempo estimado de retorno em anos

        // Estimativa Ambiental
        const co2Evitado = energiaNecessaria * 0.084; // Em média, 1 kWh evita ~0.084 kg de CO₂
        const arvoresEquivalentes = co2Evitado / 20; // 1 árvore absorve cerca de 20 kg de CO₂ por ano
        const kmNaoRodados = co2Evitado / 0.2; // Aproximadamente, 1 km de carro gera ~0.2 kg de CO₂

        // Exibição dos resultados
        document.getElementById('resultados').innerHTML = `
            <div class="result-item">
                <p><strong>Tipo de Painel:</strong> Painel de 300W (0,3 kW).</p>
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
            <div class="result-item">
                <p><strong>Potência Total Instalada:</strong> ${potenciaTotal.toFixed(2)} kW.</p>
            </div>
            <div class="result-item">
                <p><strong>Geração Média Mensal:</strong> ${geracaoMensal.toFixed(2)} kWh.</p>
            </div>
            <div class="result-item">
                <p><strong>Economia Anual Estimada:</strong> R$ ${economiaAnual.toFixed(2)}.</p>
            </div>
            <div class="result-item">
                <p><strong>Tempo Estimado de Retorno (Payback):</strong> ${payback.toFixed(1)} anos.</p>
            </div>
            <div class="result-item">
                <p><strong>CO₂ Evitado por Ano:</strong> ${co2Evitado.toFixed(2)} kg.</p>
            </div>
            <div class="result-item">
                <p><strong>Equivalente a:</strong> ${arvoresEquivalentes.toFixed(1)} árvores plantadas / ${kmNaoRodados.toFixed(1)} km não rodados.</p>
            </div>
        `;
    });
});
