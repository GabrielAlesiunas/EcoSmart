document.addEventListener('DOMContentLoaded', function () {
    function atualizarTarifa() {
        const estado = document.getElementById('calculadora-estado').value;
        const cidade = document.getElementById('calculadora-cidade').value;

        if (!cidade) {
            document.getElementById('calculadora-fornecedor').value = '';
            document.getElementById('calculadora-preco').value = '';
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
            document.getElementById('calculadora-fornecedor').value = dados.fornecedor;
            document.getElementById('calculadora-preco').value = dados.tarifa;
        } else {
            document.getElementById('calculadora-fornecedor').value = '';
            document.getElementById('calculadora-preco').value = '';
        }
    }

    document.getElementById('calculadora-estado').addEventListener('change', atualizarTarifa);
    document.getElementById('calculadora-cidade').addEventListener('change', atualizarTarifa);

    function escolherPainel(consumoNecessario) {
        const painéis = [
            { modelo: 'Painel 300W', potencia: 0.3, custo: 1500, area: 1.5 },
            { modelo: 'Painel 350W', potencia: 0.35, custo: 1700, area: 1.6 },
            { modelo: 'Painel 400W', potencia: 0.4, custo: 1900, area: 1.7 },
            { modelo: 'Painel 450W', potencia: 0.45, custo: 2100, area: 1.8 }
        ];

        let painelEscolhido = null;
        let energiaDiariaPorPainel;

        for (let painel of painéis) {
            energiaDiariaPorPainel = painel.potencia * 4.5;
            const energiaMensalPorPainel = energiaDiariaPorPainel * 30;

            if (energiaMensalPorPainel >= consumoNecessario) {
                painelEscolhido = painel;
                break;
            }
        }

        if (!painelEscolhido) {
            painelEscolhido = painéis[painéis.length - 1];
        }

        return painelEscolhido;
    }

    document.querySelector('#calculadora-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const consumo = parseFloat(document.getElementById('calculadora-consumo').value);
        const preco = parseFloat(document.getElementById('calculadora-preco').value);
        const percentualEconomia = parseFloat(document.getElementById('calculadora-percentual-economia').value);

        const irradiacaoMedia = 4.5;

        if (isNaN(consumo) || consumo <= 0 || isNaN(percentualEconomia) || percentualEconomia <= 0 || percentualEconomia > 100) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        const energiaNecessaria = consumo * (percentualEconomia / 100);
        const painelEscolhido = escolherPainel(energiaNecessaria);

        if (!painelEscolhido) {
            alert('Não foi possível encontrar um painel solar adequado para o consumo desejado.');
            return;
        }

        const energiaDiariaPorPainel = painelEscolhido.potencia * irradiacaoMedia;
        const energiaMensalPorPainel = energiaDiariaPorPainel * 30;
        const quantidadePainel = Math.ceil(energiaNecessaria / energiaMensalPorPainel);
        const espacoNecessario = quantidadePainel * painelEscolhido.area;
        const custoTotal = quantidadePainel * painelEscolhido.custo;
        const potenciaTotal = quantidadePainel * painelEscolhido.potencia;
        const geracaoMensal = energiaMensalPorPainel * quantidadePainel;
        const economiaMensal = energiaNecessaria * preco;
        const economiaAnual = economiaMensal * 12;
        const payback = custoTotal / economiaAnual;
        const co2Evitado = energiaNecessaria * 0.1;
        const arvoresEquivalentes = co2Evitado / 25;
        const kmNaoRodados = co2Evitado / 0.3144;

        document.getElementById('calculadora-resultados').innerHTML = `
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

        // Enviar dados dos cards para o backend Flask
        const payload = {
            painel: painelEscolhido.modelo,
            quantidadePainel: quantidadePainel,
            espaco: espacoNecessario,
            consumo: consumo,
            potenciaTotal,
            geracaoMensal,
            custoTotal,
            economiaAnual,
            payback,
            co2Evitado,
            arvores: arvoresEquivalentes,
            km: kmNaoRodados
        };

        fetch('/calcular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); // Transformar resposta em JSON para acessar os dados
                } else {
                    throw new Error('Erro ao gerar gráfico.');
                }
            })
            .then(data => {
                console.log('Dados dos cards enviados com sucesso para o backend.');

                // Agora sim acessa os caminhos dos gráficos dentro de data
                document.getElementById('graf1').src = data.graficoInvestimento + '?' + new Date().getTime();
                document.getElementById('graf2').src = data.graficoSustentabilidade + '?' + new Date().getTime();
                document.getElementById('graf3').src = data.graficoEnergia + '?' + new Date().getTime();
                document.getElementById('graficos-container').style.display = 'block';
            })
            .catch(error => {
                console.error('Erro de conexão com o servidor:', error);
            });

    });
});
