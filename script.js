// Aguarda o DOM ser completamente carregado antes de executar o JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do DOM que serão utilizados
    const itemForm = document.getElementById('itemForm');
    const itemInput = document.getElementById('itemInput');
    const quantityInput = document.getElementById('quantityInput');
    const priceInput = document.getElementById('priceInput');
    const itemList = document.getElementById('itemList');
    const totalValue = document.getElementById('totalValue');
    const clearAllBtn = document.getElementById('clearAll');
    const saveListBtn = document.getElementById('saveList');
    const loadListBtn = document.getElementById('loadList');
    
    // Array para armazenar os itens da lista
    let items = [];
    
    // Função para calcular o total da compra
    function calculateTotal() {
        const total = items.reduce((sum, item) => {
            // Verifica se o item tem preço e não está marcado como comprado
            if (item.price && !item.completed) {
                return sum + (item.price * item.quantity);
            }
            return sum;
        }, 0);
        
        // Atualiza o valor total no DOM
        totalValue.textContent = total.toFixed(2);
    }
    
    // Função para renderizar a lista de itens no DOM
    function renderItems() {
        // Limpa a lista antes de renderizar
        itemList.innerHTML = '';
        
        // Para cada item, cria um elemento li e adiciona à lista
        items.forEach((item, index) => {
            const li = document.createElement('li');
            
            // Adiciona classe 'completed' se o item estiver marcado como comprado
            if (item.completed) {
                li.classList.add('completed');
            }
            
            // Cria o conteúdo do item
            li.innerHTML = `
                <span>
                    ${item.name} (${item.quantity}x) 
                    ${item.price ? `- R$ ${(item.price * item.quantity).toFixed(2)}` : ''}
                </span>
                <div>
                    <button class="complete-btn" data-index="${index}">✓</button>
                    <button class="delete-btn" data-index="${index}">×</button>
                </div>
            `;
            
            // Adiciona o item à lista
            itemList.appendChild(li);
        });
        
        // Recalcula o total sempre que a lista é renderizada
        calculateTotal();
    }
    
    // Função para adicionar um novo item à lista
    function addItem(e) {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        
        // Obtém os valores dos inputs
        const name = itemInput.value.trim();
        const quantity = parseInt(quantityInput.value) || 1;
        const price = parseFloat(priceInput.value) || null;
        
        // Validação básica - verifica se o nome do item foi informado
        if (!name) {
            alert('Por favor, informe o nome do item');
            return;
        }
        
        // Cria um novo objeto de item
        const newItem = {
            name,
            quantity,
            price,
            completed: false
        };
        
        // Adiciona o novo item ao array
        items.push(newItem);
        
        // Renderiza a lista atualizada
        renderItems();
        
        // Limpa os campos do formulário
        itemInput.value = '';
        quantityInput.value = '1';
        priceInput.value = '';
        
        // Coloca o foco de volta no campo de nome
        itemInput.focus();
    }
    
    // Função para marcar/desmarcar item como comprado
    function toggleComplete(e) {
        // Verifica se o clique foi em um botão de completar
        if (e.target.classList.contains('complete-btn')) {
            const index = e.target.getAttribute('data-index');
            
            // Inverte o status de 'completed' do item
            items[index].completed = !items[index].completed;
            
            // Renderiza a lista atualizada
            renderItems();
        }
    }
    
    // Função para remover um item da lista
    function deleteItem(e) {
        // Verifica se o clique foi em um botão de deletar
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            
            // Remove o item do array
            items.splice(index, 1);
            
            // Renderiza a lista atualizada
            renderItems();
        }
    }
    
    // Função para limpar toda a lista
    function clearAllItems() {
        // Confirmação antes de limpar
        if (confirm('Tem certeza que deseja limpar toda a lista?')) {
            // Esvazia o array de itens
            items = [];
            
            // Renderiza a lista vazia
            renderItems();
        }
    }
    
    // Função para salvar a lista no localStorage
    function saveList() {
        // Converte o array de itens para JSON e armazena no localStorage
        localStorage.setItem('shoppingList', JSON.stringify(items));
        alert('Lista salva com sucesso!');
    }
    
    // Função para carregar a lista do localStorage
    function loadList() {
        // Obtém a lista armazenada no localStorage
        const savedList = localStorage.getItem('shoppingList');
        
        // Se existir uma lista salva, carrega os itens
        if (savedList) {
            // Converte de JSON para array de objetos
            items = JSON.parse(savedList);
            
            // Renderiza os itens carregados
            renderItems();
            alert('Lista carregada com sucesso!');
        } else {
            alert('Nenhuma lista encontrada no armazenamento local.');
        }
    }
    
    // Adiciona os event listeners
    
    // Formulário para adicionar itens
    itemForm.addEventListener('submit', addItem);
    
    // Delegation para os botões dentro da lista (complete e delete)
    itemList.addEventListener('click', function(e) {
        toggleComplete(e);
        deleteItem(e);
    });
    
    // Botão para limpar toda a lista
    clearAllBtn.addEventListener('click', clearAllItems);
    
    // Botão para salvar a lista
    saveListBtn.addEventListener('click', saveList);
    
    // Botão para carregar a lista
    loadListBtn.addEventListener('click', loadList);
    
    // Renderiza a lista vazia inicialmente
    renderItems();
});