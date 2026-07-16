import urllib.request
import urllib.parse
import json
import os

# Cloudinary config from the app
CLOUD_NAME = "dqacbq4qp"
UPLOAD_PRESET = "Insync_profiles"
IMAGE_PATH = "/home/ubuntu/webdev-static-assets/sarah_torens_real.jpg"

# Read image file
with open(IMAGE_PATH, "rb") as f:
    image_data = f.read()

# Build multipart form data
boundary = "----FormBoundary7MA4YWxkTrZu0gW"

def build_multipart(fields, files):
    body = b""
    for name, value in fields.items():
        body += f"--{boundary}\r\n".encode()
        body += f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode()
        body += f"{value}\r\n".encode()
    for name, (filename, data, content_type) in files.items():
        body += f"--{boundary}\r\n".encode()
        body += f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode()
        body += f"Content-Type: {content_type}\r\n\r\n".encode()
        body += data + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    return body

body = build_multipart(
    {"upload_preset": UPLOAD_PRESET},
    {"file": ("sarah_torens.jpg", image_data, "image/jpeg")}
)

url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
req = urllib.request.Request(
    url,
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST"
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        print("CLOUDINARY_URL:", data.get("secure_url"))
        print("PUBLIC_ID:", data.get("public_id"))
except urllib.error.HTTPError as e:
    body_err = e.read().decode()
    print("ERROR:", e.code, body_err)
