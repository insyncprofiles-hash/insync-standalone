import os
import json
import urllib.request

token = os.environ.get("BITLY_ACCESS_TOKEN", "")
long_url = "https://insyncprofiles.net/demo/sarah-ot"

payload = json.dumps({
    "long_url": long_url,
    "title": "Sarah Torens OT - InSync Profile"
}).encode("utf-8")

req = urllib.request.Request(
    "https://api-ssl.bitly.com/v4/shorten",
    data=payload,
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        print("SHORT_URL:", data.get("link"))
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print("ERROR:", e.code, body)
