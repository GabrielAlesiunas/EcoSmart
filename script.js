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

    // Função para escolher o painel solar adequado
    function escolherPainel(consumoNecessario) {
        const painéis = [
            { modelo: 'Painel 300W', potencia: 0.3, custo: 1500, area: 1.5 },
            { modelo: 'Painel 350W', potencia: 0.35, custo: 1700, area: 1.6 },
            { modelo: 'Painel 400W', potencia: 0.4, custo: 1900, area: 1.7 },
            { modelo: 'Painel 450W', potencia: 0.45, custo: 2100, area: 1.8 }
        ];

        let painelEscolhido = null;
        let energiaDiariaPorPainel;
        
        // Ordena os painéis de maior para menor potência
        const painéisOrdenados = painéis.sort((a, b) => b.potencia - a.potencia);

        // Agora, vamos tentar encontrar o painel adequado para o consumo
        for (let painel of painéisOrdenados) {
            energiaDiariaPorPainel = painel.potencia * 4.5; // Considerando irradiância média de 4.5 horas por dia
            const energiaMensalPorPainel = energiaDiariaPorPainel * 30; // Geração mensal

            if (energiaMensalPorPainel >= consumoNecessario) {
                painelEscolhido = painel;
                break;
            }
        }

        // Se nenhum painel for encontrado, o código irá usar o painel com maior potência disponível
        if (!painelEscolhido) {
            painelEscolhido = painéis[0]; // Usar o painel de maior potência
        }

        return painelEscolhido;
    }

    // Calculando os resultados quando o formulário for enviado
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        const consumo = parseFloat(document.getElementById('consumo').value);
        const preco = parseFloat(document.getElementById('preco').value);
        const percentualEconomia = parseFloat(document.getElementById('percentual-economia').value);

        const irradiacaoMedia = 4.5; // Média diária de sol em horas em SP

        if (isNaN(consumo) || consumo <= 0 || isNaN(percentualEconomia) || percentualEconomia <= 0 || percentualEconomia > 100) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        // Quantidade de energia que o usuário quer compensar (em kWh)
        const energiaNecessaria = consumo * (percentualEconomia / 100);

        // Escolher o painel solar adequado para a necessidade de energia
        const painelEscolhido = escolherPainel(energiaNecessaria);

        // Verificar se o painel foi encontrado
        if (!painelEscolhido) {
            alert('Não foi possível encontrar um painel solar adequado para o consumo desejado.');
            return;
        }

        // Cálculos baseados no painel escolhido
        const energiaDiariaPorPainel = painelEscolhido.potencia * irradiacaoMedia;
        const energiaMensalPorPainel = energiaDiariaPorPainel * 30;
        const quantidadePainel = Math.ceil(energiaNecessaria / energiaMensalPorPainel);

        // Espaço necessário considerando o painel escolhido
        const espacoNecessario = quantidadePainel * painelEscolhido.area;

        // Custo total estimado
        const custoTotal = quantidadePainel * painelEscolhido.custo;

        // Sistema indicado
        const potenciaTotal = quantidadePainel * painelEscolhido.potencia; // Potência total instalada em kW
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
            <div class="card">
                <p>ESPECIFICAÇÕES TÉCNICAS</p>
                <i class="fa-solid fa-solar-panel"></i>
                <p><strong>Tipo de Painel:</strong> ${painelEscolhido.modelo}.</p>
                <p><strong>Quantidade de Painéis Necessários:</strong> ${quantidadePainel} painéis.</p>
                <p><strong>Espaço Necessário (m²):</strong> ${espacoNecessario.toFixed(2)} m².</p>
                <p><strong>Potência Total Instalada:</strong> ${potenciaTotal.toFixed(2)} kW.</p>
                <p><strong>Geração Média Mensal:</strong> ${geracaoMensal.toFixed(2)} kWh.</p>
            </div>

            <div class="card">
                <p>INVESTIMENTO</p>
                <i class="fa-solid fa-money-check-dollar"></i>
                <p><strong>Custo Total Estimado (R$):</strong> R$ ${custoTotal.toFixed(2)}.</p>
                <p><strong>Economia Anual Estimada:</strong> R$ ${economiaAnual.toFixed(2)}.</p>
                <p><strong>Tempo Estimado de Retorno (Payback):</strong> ${payback.toFixed(1)} anos.</p>
            </div>

            <div class="card">
                <p>SUSTENTABILIDADE</p>
                <i class="fa-solid fa-seedling"></i>
                <p><strong>CO₂ Evitado por Ano:</strong> ${co2Evitado.toFixed(2)} kg.</p>
                <p><strong>Equivalente a:</strong> ${arvoresEquivalentes.toFixed(1)} árvores plantadas / ${kmNaoRodados.toFixed(1)} km não rodados.</p>
            </div>
        `;
    });
});
