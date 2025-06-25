// Aguarda o DOM ser completamente carregado antes de executar o JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do DOM que serão utilizados
    const itemForm = document.getElementById('itemForm'); // Formulário de adição
    const itemInput = document.getElementById('itemInput'); // Campo de texto para novo item
    const itemList = document.getElementById('itemList'); // Lista UL onde os itens serão renderizados
    const clearAllBtn = document.getElementById('clearAll'); // Botão para limpar tudo
    const itemCount = document.getElementById('itemCount'); // Elemento que mostra a contagem de itens
    
    // Array que armazenará todos os itens da lista
    let items = [];
    
    // Função para carregar itens do localStorage quando a página é carregada
    function loadItems() {
        // Obtém os itens armazenados no localStorage com a chave 'shoppingItems'
        const storedItems = localStorage.getItem('shoppingItems');
        
        // Se existirem itens armazenados
        if (storedItems) {
            // Converte de JSON string para array JavaScript
            items = JSON.parse(storedItems);
            
            // Renderiza os itens na tela
            renderItems();
            
            // Atualiza o contador de itens
            updateItemCount();
        }
    }
    
    // Função para salvar os itens no localStorage
    function saveItems() {
        // Converte o array 'items' para JSON string e armazena no localStorage
        localStorage.setItem('shoppingItems', JSON.stringify(items));
        
        // Atualiza o contador de itens após salvar
        updateItemCount();
    }
    
    // Função principal que renderiza todos os itens na tela
    function renderItems() {
        // Limpa o conteúdo atual da lista
        itemList.innerHTML = '';
        
        // Para cada item no array 'items', cria um elemento na lista
        items.forEach((item, index) => {
            // Cria um novo elemento <li> para o item
            const li = document.createElement('li');
            
            // Classes base do Bootstrap para estilização
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            // Se o item estiver marcado como completo, adiciona classe 'completed'
            if (item.completed) {
                li.classList.add('completed');
            }
            
            // HTML interno do item da lista
            li.innerHTML = `
                <span class="item-text">${item.text}</span>
                <div>
                    <!-- Botão para marcar/desmarcar como completo -->
                    <button class="btn btn-sm ${item.completed ? 'btn-warning' : 'btn-success'} complete-btn me-1">
                        <i class="bi ${item.completed ? 'bi-arrow-counterclockwise' : 'bi-check'}"></i>
                    </button>
                    <!-- Botão para deletar o item -->
                    <button class="btn btn-sm btn-danger delete-btn">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            // Adiciona atributos de dados para identificar os itens nos eventos
            li.querySelector('.complete-btn').setAttribute('data-index', index);
            li.querySelector('.delete-btn').setAttribute('data-index', index);
            
            // Adiciona o item à lista
            itemList.appendChild(li);
        });
    }
    
    // Função que atualiza o contador de itens (completos/total)
    function updateItemCount() {
        // Conta o total de itens
        const totalItems = items.length;
        
        // Filtra apenas os itens completos
        const completedItems = items.filter(item => item.completed).length;
        
        // Atualiza o texto do contador
        itemCount.textContent = `${completedItems}/${totalItems} itens`;
        
        // Muda a cor do badge baseado no progresso:
        // Verde se todos estiverem completos, cinza caso contrário
        if (completedItems === totalItems && totalItems > 0) {
            itemCount.className = 'badge bg-success';
        } else {
            itemCount.className = 'badge bg-secondary';
        }
    }
    
    // Função para adicionar um novo item à lista
    function addItem(e) {
        // Previne o comportamento padrão do formulário (recarregar a página)
        e.preventDefault();
        
        // Obtém e limpa o texto do input
        const itemText = itemInput.value.trim();
        
        // Verifica se o texto não está vazio
        if (itemText) {
            // Adiciona novo objeto ao array 'items'
            items.push({
                text: itemText,       // Texto do item
                completed: false      // Status inicial (não completado)
            });
            
            // Salva no localStorage
            saveItems();
            
            // Re-renderiza a lista
            renderItems();
            
            // Limpa o campo de input e coloca o foco nele
            itemInput.value = '';
            itemInput.focus();
        }
    }
    
    // Função para alternar o status de completo/incompleto
    function toggleComplete(e) {
        // Verifica se o clique foi no botão de completar ou em seu ícone
        if (e.target.closest('.complete-btn')) {
            // Obtém o índice do item a partir do atributo data-index
            const index = e.target.closest('.complete-btn').getAttribute('data-index');
            
            // Inverte o status de 'completed'
            items[index].completed = !items[index].completed;
            
            // Salva e re-renderiza
            saveItems();
            renderItems();
        }
    }
    
    // Função para remover um item da lista
    function deleteItem(e) {
        // Verifica se o clique foi no botão de deletar ou em seu ícone
        if (e.target.closest('.delete-btn')) {
            // Obtém o índice do item
            const index = e.target.closest('.delete-btn').getAttribute('data-index');
            
            // Remove o item do array
            items.splice(index, 1);
            
            // Salva e re-renderiza
            saveItems();
            renderItems();
        }
    }
    
    // Função para limpar toda a lista
    function clearAllItems() {
        // Só executa se houver itens e após confirmação do usuário
        if (items.length > 0 && confirm('Tem certeza que deseja limpar toda a lista?')) {
            // Esvazia o array
            items = [];
            
            // Salva e re-renderiza
            saveItems();
            renderItems();
        }
    }
    
    // ========== EVENT LISTENERS ========== //
    
    // Adiciona listener para o envio do formulário
    itemForm.addEventListener('submit', addItem);
    
    // Adiciona listener delegado à lista para os eventos de clique
    // Isso funciona para itens dinâmicos (adicionados depois)
    itemList.addEventListener('click', function(e) {
        toggleComplete(e);  // Verifica se foi clique em completar
        deleteItem(e);      // Verifica se foi clique em deletar
    });
    
    // Adiciona listener para o botão de limpar tudo
    clearAllBtn.addEventListener('click', clearAllItems);
    
    // ========== INICIALIZAÇÃO ========== //
    
    // Carrega os itens do localStorage quando a página é carregada
    loadItems();
});