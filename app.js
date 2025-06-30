// Model
class ReembolsoModel {
    constructor() {
        this.reembolsos = [];
    }
    adicionar(reembolso) {
        this.reembolsos.push(reembolso);
    }
    editar(index, novoReembolso) {
        this.reembolsos[index] = novoReembolso;
    }
    excluir(index) {
        this.reembolsos.splice(index, 1);
    }
    getTodos() {
        return this.reembolsos;
    }
    getTotal() {
        return this.reembolsos.reduce((soma, r) => soma + r.valor, 0);
    }
}

// View
class ReembolsoView {
    constructor() {
        this.tabela = document.getElementById('tabelaReembolsos').getElementsByTagName('tbody')[0];
        this.total = document.getElementById('totalReembolso');
    }
    formatarValor(valor) {
        return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    formatarData(dataISO) {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano.slice(2)}`;
    }
    atualizar(reembolsos, total) {
        this.tabela.innerHTML = '';
        reembolsos.forEach((r, i) => {
            const row = this.tabela.insertRow();
            row.insertCell(0).innerText = r.tipo.toUpperCase();
            row.insertCell(1).innerText = r.descricao;
            row.insertCell(2).innerText = this.formatarData(r.dataDespesa);
            row.insertCell(3).innerText = this.formatarValor(r.valor);
            const cellAcoes = row.insertCell(4);
            cellAcoes.innerHTML = `
                <button class="btn-editar" data-index="${i}" title="Editar" aria-label="Editar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#218838" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                </button>
                <button class="btn-excluir" data-index="${i}" title="Excluir" aria-label="Excluir">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c82333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            `;
        });
        this.total.innerText = this.formatarValor(total);
    }
}

// Controller
class ReembolsoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.cabecalhoForm = document.getElementById('cabecalhoForm');
        this.reembolsoForm = document.getElementById('reembolsoForm');
        this.cabecalhoInfo = document.getElementById('cabecalhoInfo');
        this.editandoIndex = null;
        this.cabecalhoForm.addEventListener('submit', e => e.preventDefault());
        document.getElementById('confirmarCabecalho').addEventListener('click', this.confirmarCabecalho.bind(this));
        this.reembolsoForm.addEventListener('submit', this.adicionarReembolso.bind(this));
        document.getElementById('tipo').addEventListener('change', this.atualizarCampos.bind(this));
        document.getElementById('btnImprimir').addEventListener('click', () => window.print());
        document.getElementById('tabelaReembolsos').addEventListener('click', this.acoesTabela.bind(this));
    }
    atualizarCampos() {
        const tipo = document.getElementById('tipo').value;
        document.getElementById('campoKm').style.display = tipo === 'km' ? 'block' : 'none';
        document.getElementById('campoValor').style.display = (tipo === 'alimentacao' || tipo === 'outros') ? 'block' : 'none';
    }
    confirmarCabecalho() {
        const colaborador = document.getElementById('colaborador').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const periodoInicial = document.getElementById('periodoInicial').value;
        const periodoFinal = document.getElementById('periodoFinal').value;
        if (!colaborador || !empresa || !periodoInicial || !periodoFinal) {
            alert('Preencha todos os campos do cabeçalho.');
            return;
        }
        this.cabecalhoInfo.innerHTML = `<strong>Colaborador:</strong> ${colaborador} &nbsp; <strong>Empresa:</strong> ${empresa} <br><strong>Período:</strong> ${periodoInicial} a ${periodoFinal}`;
        this.cabecalhoInfo.style.display = 'block';
        this.cabecalhoForm.style.display = 'none';
        this.reembolsoForm.style.display = 'block';
    }
    adicionarReembolso(event) {
        event.preventDefault();
        const tipo = document.getElementById('tipo').value;
        const descricao = document.getElementById('descricao').value || '-';
        const dataDespesa = document.getElementById('dataDespesa').value;
        let valor = 0;
        if (!dataDespesa) {
            alert('Informe a data da despesa.');
            return;
        }
        if (tipo === 'km') {
            const km = parseFloat(document.getElementById('km').value);
            if (isNaN(km) || km <= 0) {
                alert('Informe a quantidade de km.');
                return;
            }
            valor = km * 1.5;
        } else {
            valor = parseFloat(document.getElementById('valor').value);
            if (isNaN(valor) || valor <= 0) {
                alert('Informe o valor.');
                return;
            }
        }
        const novoReembolso = { tipo, descricao, dataDespesa, valor };
        if (this.editandoIndex !== null) {
            this.model.editar(this.editandoIndex, novoReembolso);
            this.editandoIndex = null;
        } else {
            this.model.adicionar(novoReembolso);
        }
        this.view.atualizar(this.model.getTodos(), this.model.getTotal());
        event.target.reset();
        this.atualizarCampos();
    }
    acoesTabela(event) {
        const btnEditar = event.target.closest('.btn-editar');
        const btnExcluir = event.target.closest('.btn-excluir');
        if (btnEditar) {
            const index = parseInt(btnEditar.getAttribute('data-index'));
            const r = this.model.getTodos()[index];
            document.getElementById('tipo').value = r.tipo;
            document.getElementById('descricao').value = r.descricao;
            document.getElementById('dataDespesa').value = r.dataDespesa;
            if (r.tipo === 'km') {
                document.getElementById('km').value = (r.valor / 1.5).toFixed(2);
            } else {
                document.getElementById('valor').value = r.valor.toFixed(2);
            }
            this.atualizarCampos();
            this.editandoIndex = index;
        } else if (btnExcluir) {
            const index = parseInt(btnExcluir.getAttribute('data-index'));
            if (confirm('Deseja realmente excluir este lançamento?')) {
                this.model.excluir(index);
                this.view.atualizar(this.model.getTodos(), this.model.getTotal());
            }
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const model = new ReembolsoModel();
    const view = new ReembolsoView();
    const controller = new ReembolsoController(model, view);
}); 