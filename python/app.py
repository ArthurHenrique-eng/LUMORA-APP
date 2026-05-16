from pathlib import Path
from flask import Flask, render_template, request, redirect
import sqlite3


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "sql" / "LUMORA_APP.db"

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR),
    static_url_path="",
)


@app.route("/")
@app.route("/login")
@app.route("/login.html")
def inicio():
    return render_template("login.html")



@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    senha = request.form.get("senha") or request.form.get("password")

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


    return redirect("/cadastro")



@app.route("/cadastro")
@app.route("/cadastro.html")
def cadastro():
    return render_template("cadastro.html")



@app.route("/recuperar-senha.html")
def recuperar_senha():
    return render_template("recuperar-senha.html")


@app.route("/registrar", methods=["POST"])
def registrar():
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


    return redirect("/")



@app.route("/home")
@app.route("/index.html")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
