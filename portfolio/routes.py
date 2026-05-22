from flask import url_for, render_template, flash, redirect, request, jsonify
from flask_mail import Message
from portfolio import app,mail
import urllib.request
import urllib.error
import json
import time

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

# In-memory cache for LeetCode stats
LEETCODE_CACHE = {
    "data": None,
    "timestamp": 0
}
CACHE_DURATION = 900  # 15 minutes (in seconds)

def get_leetcode_stats(username):
    global LEETCODE_CACHE
    current_time = time.time()
    
    # Return cached data if it exists and is not expired
    if LEETCODE_CACHE["data"] and (current_time - LEETCODE_CACHE["timestamp"]) < CACHE_DURATION:
        return LEETCODE_CACHE["data"]

    url = "https://leetcode.com/graphql/"
    query = """
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        submissionCalendar
      }
    }
    """
    variables = {"username": username}
    payload = json.dumps({'query': query, 'variables': variables}).encode('utf-8')
    
    headers = {
        "Content-Type": "application/json",
        "Referer": f"https://leetcode.com/{username}/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                res_data = json.loads(response.read().decode('utf-8'))
                if "data" in res_data and res_data["data"].get("matchedUser"):
                    user_data = res_data["data"]["matchedUser"]
                    ac_submissions = user_data.get("submitStats", {}).get("acSubmissionNum", [])
                    
                    stats = {
                        "totalSolved": 0,
                        "easySolved": 0,
                        "mediumSolved": 0,
                        "hardSolved": 0
                    }
                    for item in ac_submissions:
                        diff = item.get("difficulty")
                        count = item.get("count", 0)
                        if diff == "All":
                            stats["totalSolved"] = count
                        elif diff == "Easy":
                            stats["easySolved"] = count
                        elif diff == "Medium":
                            stats["mediumSolved"] = count
                        elif diff == "Hard":
                            stats["hardSolved"] = count
                            
                    sub_cal_str = user_data.get("submissionCalendar", "{}")
                    try:
                        submission_calendar = json.loads(sub_cal_str)
                    except Exception:
                        submission_calendar = {}
                        
                    formatted_data = {
                        "status": "success",
                        "totalSolved": stats["totalSolved"],
                        "easySolved": stats["easySolved"],
                        "mediumSolved": stats["mediumSolved"],
                        "hardSolved": stats["hardSolved"],
                        "submissionCalendar": submission_calendar
                    }
                    LEETCODE_CACHE["data"] = formatted_data
                    LEETCODE_CACHE["timestamp"] = current_time
                    return formatted_data
    except Exception as e:
        app.logger.error(f"Error fetching LeetCode data: {e}")
        
    # If fetch fails, fall back to cache even if expired
    if LEETCODE_CACHE["data"]:
        return LEETCODE_CACHE["data"]
        
    return {"status": "error", "message": "Failed to retrieve LeetCode stats"}

@app.route("/api/leetcode")
def leetcode_api():
    data = get_leetcode_stats("Harsh_tadokar")
    return jsonify(data)
