import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Certifique-se de ter um arquivo CSS associado

const App = () => {
    const [produtos, setProdutos] = useState([]);
    const [view, setView] = useState(""); // Estado para controlar qual formulário exibir
    const [nome, setNome] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [preco, setPreco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
    const [idEditando, setIdEditando] = useState(null);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchProdutos = async () => {
        try {
            const response = await axios.get("https://backend-aula.vercel.app/app/produtos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProdutos(response.data);
            setView("listar");
        } catch (err) {
            console.error("Erro ao buscar produtos:", err);
            setError("Erro ao buscar produtos.");
        }
    };

    const clearForm = () => {
        setNome("");
        setQuantidade("");
        setPreco("");
        setDescricao("");
        setImagem("");
        setIdEditando(null);
        setError("");
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete("https://backend-aula.vercel.app/app/produtos", {
                data: { id: id },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProdutos(produtos.filter((produto) => produto._id !== id));
        } catch (err) {
            console.error("Erro ao deletar produto:", err);
            setError("Erro ao deletar produto.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const produto = {
            id: idEditando,
            nome,
            quantidade,
            preco,
            descricao,
            imagem,
        };

        try {
            if (idEditando) {
                // Editar produto
                await axios.put("https://backend-aula.vercel.app/app/produtos", produto, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProdutos(produtos.map((p) => (p._id === idEditando ? { ...p, ...produto } : p)));
            } else {
                // Adicionar novo produto
                const response = await axios.post("https://backend-aula.vercel.app/app/produtos", produto, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProdutos([...produtos, response.data]);
            }
            clearForm();
            setView("");
        } catch (err) {
            console.error("Erro ao salvar produto:", err);
            setError("Erro ao salvar produto.");
        }
    };

    return (
        <div className="container">
            {error && <p style={{ color: "red" }}>{error}</p>}

            {view === "" && (
                <div className="button-grid">
                    <button onClick={() => setView("adicionar")} className="button button-large">
                        Adicionar
                    </button>
                    <button onClick={fetchProdutos} className="button button-large">
                        Listar
                    </button>
                </div>
            )}

            {view === "listar" && produtos.length > 0 && (
                <div>
                    <h3>Produtos Cadastrados:</h3>
                    <div className="product-grid">
                        {produtos.map((produto) => (
                            <div key={produto._id} className="product-card">
                                <img
                                    src={produto.imagem || "https://via.placeholder.com/150"}
                                    alt={produto.nome}
                                    className="product-image"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                />
                                <p><strong>{produto.nome}</strong></p>
                                <p>Quantidade: {produto.quantidade}</p>
                                <p>Preço: R$ {produto.preco}</p>
                                <p>{produto.descricao}</p>
                                <div className="button-group">
                                    <button
                                        onClick={() => {
                                            setNome(produto.nome);
                                            setQuantidade(produto.quantidade);
                                            setPreco(produto.preco);
                                            setDescricao(produto.descricao);
                                            setImagem(produto.imagem);
                                            setIdEditando(produto._id);
                                            setView("alterar");
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(produto._id)}>Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="back-button" onClick={() => setView("")}>
                        Voltar
                    </button>
                </div>
            )}

            {view === "adicionar" && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantidade"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Preço"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Imagem (URL)"
                        value={imagem}
                        onChange={(e) => setImagem(e.target.value)}
                        required
                    />
                    <div className="button-container">
                        <button type="submit">Adicionar Produto</button>
                        <button type="button" onClick={() => setView("")}>
                            Voltar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default App;
