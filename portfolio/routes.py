from flask import url_for, render_template, flash, redirect, request
from flask_mail import Message
from portfolio import app,mail

@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html",title="Harsh-Kumar")

@app.route("/send-message", methods=["POST"])
def send_message():

    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    msg = Message(
    subject=f"Portfolio Contact from {name}",
    sender="your_email@gmail.com",
    recipients=["your_email@gmail.com"],
    reply_to=email,
    body=f"""
Name: {name}

Email: {email}

Message:
{message}
"""
    )

    mail.send(msg)

    flash("Message sent successfully!")

    return redirect("/")
