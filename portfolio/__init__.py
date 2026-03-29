import os
from flask import Flask
from flask_mail import Mail

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "0486294e3efcbca49c676be53f11b6c0")

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME", "harsh07tadokar@gmail.com")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD", "qqqfcbaqcfcemmej")

mail = Mail(app)
from portfolio import routes