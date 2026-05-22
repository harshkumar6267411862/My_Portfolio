import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from portfolio import app

# Vercel needs the app object named 'app'
