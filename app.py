from flask import Flask, render_template, request, jsonify
import matplotlib.pyplot as plt
import os
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def calcular():
    dados = request.get_json()

    painel = dados.get('painel')
    quantidade = dados.get('quantidadePainel')
    custo = dados.get('custoTotal')
    economia = dados.get('economiaAnual')
    payback = dados.get('payback')
    co2 = dados.get('co2Evitado')
    arvores = dados.get('arvores')
    km = dados.get('km')
    geracaoMensal = dados.get('geracaoMensal')
    consumo = dados.get('consumo')

    pasta_img = os.path.join('static', 'img')
    os.makedirs(pasta_img, exist_ok=True)

    # --- Gráfico 1: Investimento
    plt.figure(figsize=(6, 4))
    plt.bar(['Custo Total (R$)', 'Economia Anual (R$)'], [custo, economia], color=['#ff4d4d', '#4caf50'])
    plt.title(f'Investimento - Payback: {payback:.1f} anos')
    plt.ylabel('R$')
    plt.grid(axis='y', linestyle='--', alpha=0.6)
    for i, v in enumerate([custo, economia]):
        plt.text(i, v + max([custo, economia]) * 0.02, f'R$ {v:,.0f}', ha='center')
    plt.tight_layout()
    caminho_grafico1 = os.path.join(pasta_img, 'grafico_investimento.png')
    plt.savefig(caminho_grafico1)
    plt.close()

    # --- Gráfico 3: Energia Gerada vs Consumo Mensal (estilo melhorado)
    plt.figure(figsize=(6, 4))

    # Valores
    labels = ['Energia (kWh)']
    largura = 0.35
    x = np.arange(len(labels))

    # Barras lado a lado
    plt.bar(x - largura/2, [geracaoMensal], width=largura, label='Geração', color='#2196f3')
    plt.bar(x + largura/2, [consumo], width=largura, label='Consumo', color='#f44336')

    # Texto nas barras
    plt.text(x[0] - largura/2, geracaoMensal + consumo * 0.02, f'{geracaoMensal:.0f} kWh', 
             ha='center', va='bottom', fontsize=10, color='#0d47a1')
    plt.text(x[0] + largura/2, consumo + consumo * 0.02, f'{consumo:.0f} kWh', 
             ha='center', va='bottom', fontsize=10, color='#b71c1c')

    # Estilo do gráfico
    plt.xticks(x, labels)
    plt.title('Comparação Mensal: Energia Gerada x Consumo', fontsize=12, weight='bold')
    plt.ylabel('kWh')
    plt.ylim(0, max(geracaoMensal, consumo) * 1.3)
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.legend(loc='upper right')
    plt.tight_layout()

    caminho_grafico3 = os.path.join(pasta_img, 'grafico_energia.png')
    plt.savefig(caminho_grafico3)
    plt.close()

    # --- Gráfico 2: Sustentabilidade
    plt.figure(figsize=(6, 4))
    categorias = ['CO₂ Evitado (kg)', 'Árvores 🌳', 'Km não rodados 🚗']
    valores = [co2, arvores, km]
    cores = ['#2196f3', '#66bb6a', '#ff9800']
    y_pos = np.arange(len(categorias))
    plt.barh(y_pos, valores, color=cores)
    plt.yticks(y_pos, categorias)
    plt.title('Impacto Sustentável Anual')
    for i, v in enumerate(valores):
        plt.text(v + max(valores) * 0.01, i, f'{v:,.0f}', va='center')
    plt.tight_layout()
    caminho_grafico2 = os.path.join(pasta_img, 'grafico_sustentabilidade.png')
    plt.savefig(caminho_grafico2)
    plt.close()

    return jsonify({
        'status': 'ok',
        'graficoInvestimento': '/static/img/grafico_investimento.png',
        'graficoSustentabilidade': '/static/img/grafico_sustentabilidade.png',
        'graficoEnergia': '/static/img/grafico_energia.png'
    })

if __name__ == '__main__':
    app.run(debug=True)
