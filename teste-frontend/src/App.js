import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL da API para acessar os dados das pessoas;
const apiUrl = 'http://localhost:3001/pessoas';

function App() {
    // Estado para armazenar a lista de pessoas;
    const [pessoas, setPessoas] = useState([]);
    // Estado para estar armazenando os dados do formulário;
    const [form, setForm] = useState({ nome: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' });
    // Estado que armazena o ID da pessoa em edição;
    const [editId, setEditId] = useState(null);

    // useEffect esta sendo usado para buscar os dados das pessoas assim que o componente é montado;
    useEffect(() => {
        axios.get(apiUrl).then(response => {
            setPessoas(response.data);
        });
    }, []);

    // Função que lida com o envio do formulário;
    const handleSubmit = (event) => {
        event.preventDefault();
        if (editId) {
            // Atualiza a pessoa existente;
            axios.put(`${apiUrl}/${editId}`, form).then(() => {
                setPessoas(pessoas.map(p => (p.id === editId ? { ...p, ...form } : p))); // Atualiza a lista de pessoas;
                setEditId(null); // Resetando o ID da edição;
                setForm({ nome: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' }); // Reseta o formulario;
            });
        } else {
            // Cria uma nova pessoa;
            axios.post(apiUrl, form).then(response => {
                setPessoas([...pessoas, { ...form, id: response.data.id }]); // Adiciona à nova pessoa na lista;
                setForm({ nome: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' }); // Reseta o formulario;
            });
        }
    };
    
    // Função para deletar uma pessoa;
    const handleDelete = (id) => {
        axios.delete(`${apiUrl}/${id}`).then(() => {
            setPessoas(pessoas.filter(p => p.id !== id)); // Remove a pessoa da lista;
        });
    };

    // Função para editar uma pessoa;
    const handleEdit = (pessoa) => {
        setForm(pessoa); // Preenche o formulário com os dados da pessoa;
        setEditId(pessoa.id); // Define o ID da edição;
    };

    return (
        <div>
            <h1>Cadastro de Pessoas</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome"   value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                <input type="text" placeholder="Rua"    value={form.rua} onChange={(e) => setForm({ ...form, rua: e.target.value })} required />
                <input type="text" placeholder="Número" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} required />
                <input type="text" placeholder="Bairro" value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} required />
                <input type="text" placeholder="Cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} required />
                <input type="text" placeholder="Estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} required />
                
                <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>
            </form>
            <ul>
                {pessoas.map((pessoa) => (
                    <li key={pessoa.id}>
                        {pessoa.nome}, {pessoa.rua}, {pessoa.numero}, {pessoa.bairro}, {pessoa.cidade}, {pessoa.estado}
                        <button onClick={() => handleEdit(pessoa)}>Editar</button>
                        <button onClick={() => handleDelete(pessoa.id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;