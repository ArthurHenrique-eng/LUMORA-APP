from pathlib import Path
from flask import Flask, jsonify, render_template, request, redirect
import sqlite3
from analytics import AnalyticsService


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "sql" / "LUMORA_APP.db"

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR),
    static_url_path="",
)

# Inicializa serviço de Analytics
analytics_service = AnalyticsService()


def obter_conexao():
    return sqlite3.connect(DB_PATH)


def usuario_para_dict(usuario):
    return {
        "id": usuario[0],
        "email": usuario[1],
    }


def obter_dados_requisicao():
    dados = request.get_json(silent=True)
    if dados is None:
        dados = request.form.to_dict()
    return dados


@app.route("/")
@app.route("/index.html")
def landing():
    return render_template("index.html")


@app.route("/login")
@app.route("/login.html")
def inicio():
    return render_template("login.html")



@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email", "")
    senha = request.form.get("senha") or request.form.get("password", "")

    if not email or not senha:
        return redirect("/login?erro=Preencha todos os campos")

    conexao = sqlite3.connect(DB_PATH)
    cursor = conexao.cursor()

    cursor.execute(
        """
        SELECT *
        FROM UsuariosLumoraAPP
        WHERE Email=?
        AND Senha=?
        """,
        (email, senha)
    )

    usuario = cursor.fetchone()
    conexao.close()

    if usuario:
        return redirect("/home")

    return redirect("/login?erro=Email ou senha incorretos")



@app.route("/cadastro")
@app.route("/cadastro.html")
def cadastro():
    return render_template("cadastro.html")



@app.route("/recuperar-senha.html")
def recuperar_senha():
    return render_template("recuperar-senha.html")


@app.route("/registrar", methods=["GET", "POST"])
def registrar():
    if request.method == "GET":
        return redirect("/cadastro")

    email = request.form["email"]
    senha = request.form.get("senha") or request.form.get("password")

    conexao = sqlite3.connect(DB_PATH)

    cursor = conexao.cursor()


    cursor.execute(

        """

        SELECT *

        FROM UsuariosLumoraAPP

        WHERE Email=?

        """,

        (email,)

    )


    existe = cursor.fetchone()


    if existe:

        conexao.close()

        return "Email já cadastrado"



    cursor.execute(

        """

        INSERT INTO

        UsuariosLumoraAPP(

            Email,

            Senha

        )

        VALUES(

            ?,

            ?

        )

        """,

        (email, senha)

    )


    conexao.commit()

    conexao.close()


    return redirect("/login")



@app.route("/api/usuarios", methods=["GET"])
def listar_usuarios():
    conexao = obter_conexao()
    cursor = conexao.cursor()
    cursor.execute(
        """
        SELECT IDUsuariosLumora, Email
        FROM UsuariosLumoraAPP
        ORDER BY IDUsuariosLumora
        """
    )
    usuarios = [usuario_para_dict(usuario) for usuario in cursor.fetchall()]
    conexao.close()
    return jsonify(usuarios), 200


@app.route("/api/usuarios/<int:usuario_id>", methods=["GET"])
def buscar_usuario(usuario_id):
    conexao = obter_conexao()
    cursor = conexao.cursor()
    cursor.execute(
        """
        SELECT IDUsuariosLumora, Email
        FROM UsuariosLumoraAPP
        WHERE IDUsuariosLumora=?
        """,
        (usuario_id,),
    )
    usuario = cursor.fetchone()
    conexao.close()

    if not usuario:
        return jsonify({"erro": "Usuario nao encontrado"}), 404

    return jsonify(usuario_para_dict(usuario)), 200


@app.route("/api/usuarios/<int:usuario_id>", methods=["PUT"])
def atualizar_usuario_put(usuario_id):
    dados = obter_dados_requisicao()
    email = (dados.get("email") or "").strip()
    senha = (dados.get("senha") or dados.get("password") or "").strip()

    if not email or not senha:
        return jsonify({"erro": "PUT requer email e senha"}), 400

    conexao = obter_conexao()
    cursor = conexao.cursor()
    cursor.execute(
        """
        SELECT 1
        FROM UsuariosLumoraAPP
        WHERE IDUsuariosLumora=?
        """,
        (usuario_id,),
    )
    existe = cursor.fetchone()

    if not existe:
        conexao.close()
        return jsonify({"erro": "Usuario nao encontrado"}), 404

    cursor.execute(
        """
        UPDATE UsuariosLumoraAPP
        SET Email=?, Senha=?
        WHERE IDUsuariosLumora=?
        """,
        (email, senha, usuario_id),
    )
    conexao.commit()
    conexao.close()
    return jsonify({"mensagem": "Usuario atualizado com PUT"}), 200


@app.route("/api/usuarios/<int:usuario_id>", methods=["PATCH"])
def atualizar_usuario_patch(usuario_id):
    dados = obter_dados_requisicao()
    email = dados.get("email")
    senha = dados.get("senha") or dados.get("password")

    campos = []
    valores = []

    if email is not None:
        email_limpo = email.strip()
        if not email_limpo:
            return jsonify({"erro": "Email invalido"}), 400
        campos.append("Email=?")
        valores.append(email_limpo)

    if senha is not None:
        senha_limpa = senha.strip()
        if not senha_limpa:
            return jsonify({"erro": "Senha invalida"}), 400
        campos.append("Senha=?")
        valores.append(senha_limpa)

    if not campos:
        return jsonify({"erro": "Informe ao menos um campo para atualizar"}), 400

    conexao = obter_conexao()
    cursor = conexao.cursor()
    cursor.execute(
        """
        SELECT 1
        FROM UsuariosLumoraAPP
        WHERE IDUsuariosLumora=?
        """,
        (usuario_id,),
    )
    existe = cursor.fetchone()

    if not existe:
        conexao.close()
        return jsonify({"erro": "Usuario nao encontrado"}), 404

    query = f"""
        UPDATE UsuariosLumoraAPP
        SET {", ".join(campos)}
        WHERE IDUsuariosLumora=?
    """
    valores.append(usuario_id)
    cursor.execute(query, tuple(valores))
    conexao.commit()
    conexao.close()
    return jsonify({"mensagem": "Usuario atualizado com PATCH"}), 200


@app.route("/api/usuarios/<int:usuario_id>", methods=["DELETE"])
def deletar_usuario(usuario_id):
    conexao = obter_conexao()
    cursor = conexao.cursor()
    cursor.execute(
        """
        DELETE FROM UsuariosLumoraAPP
        WHERE IDUsuariosLumora=?
        """,
        (usuario_id,),
    )
    conexao.commit()

    if cursor.rowcount == 0:
        conexao.close()
        return jsonify({"erro": "Usuario nao encontrado"}), 404

    conexao.close()
    return jsonify({"mensagem": "Usuario removido com sucesso"}), 200


@app.route("/home")
@app.route("/usuario")
def home():
    return render_template("home.html")


# ==================== ANALYTICS ROUTES ====================

@app.route("/analytics")
def analytics():
    return render_template("analytics.html")


@app.route("/api/analytics/dashboard", methods=["GET"])
def api_analytics_dashboard():
    usuario_id = request.args.get("usuario_id", 1, type=int)
    periodo = request.args.get("periodo", 30, type=int)

    try:
        kpis = analytics_service.get_dashboard_kpis(usuario_id, periodo)
        previsao = analytics_service.gerar_previsao_crescimento(usuario_id)

        return jsonify({
            "sucesso": True,
            "kpis": kpis,
            "previsao": previsao,
            "top_receitas": [],
            "top_despesas": []
        }), 200

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500


@app.route("/api/analytics/relatorio", methods=["GET"])
def api_analytics_relatorio():
    usuario_id = request.args.get("usuario_id", 1, type=int)
    periodo = request.args.get("periodo", 30, type=int)

    try:
        relatorio = analytics_service.gerar_relatorio(usuario_id, periodo)
        return jsonify({
            "sucesso": True,
            "relatorio": relatorio
        }), 200

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500


@app.route("/api/analytics/enviar-relatorio", methods=["POST"])
def api_analytics_enviar_relatorio():
    dados = request.get_json()
    usuario_id = dados.get("usuario_id", 1)
    email = dados.get("email")
    periodo = dados.get("periodo", 30)
    agendar = dados.get("agendar", False)

    if not email:
        return jsonify({"sucesso": False, "mensagem": "E-mail é obrigatório"}), 400

    try:
        # Busca dados do usuário
        conexao = obter_conexao()
        cursor = conexao.cursor()
        cursor.execute("SELECT Email FROM UsuariosLumoraAPP WHERE IDUsuariosLumora=?", (usuario_id,))
        usuario = cursor.fetchone()
        conexao.close()

        if not usuario:
            return jsonify({"sucesso": False, "mensagem": "Usuário não encontrado"}), 404

        # Gera relatório
        relatorio = analytics_service.gerar_relatorio(usuario_id, periodo)

        # Envia por e-mail
        resultado = analytics_service.enviar_relatorio_email(
            email,
            f"Usuário {usuario_id}",
            relatorio
        )

        if resultado["status"] == "erro":
            return jsonify({
                "sucesso": False,
                "mensagem": f"Erro ao enviar e-mail: {resultado['mensagem']}"
            }), 500

        # TODO: Agendar se necessário (usar scheduler como APScheduler)

        return jsonify({
            "sucesso": True,
            "mensagem": "Relatório enviado com sucesso!",
            "agendar": agendar
        }), 200

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
