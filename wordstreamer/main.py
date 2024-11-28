#!/usr/bin/env python

"""Echo server using the asyncio API."""

import asyncio
from websockets.asyncio.server import serve

import re
import io
import time
import sys
import subprocess
import threading

filename = "test.log"

def clean_token(token):
  token_l = token.lower().strip()

  # disqualify certain tokens
  bad_chars = "[]"
  if any(c in token_l for c in bad_chars):
    return ''

  return re.sub(r'[^a-zA-Z]', '', token_l)

def process(s):
  tokens = list(map(clean_token, s.split(' ')))

  tokens_clean = [t for t in tokens if t]
  return tokens_clean

async def echo(websocket):
  with io.open(filename, "r", 1) as reader:
    laststuff = ""
    # async for message in websocket:
    while websocket:
      stuff = reader.read()
      newstuff = stuff[len(laststuff):]

      words = process(newstuff)

      for word in words:
        await websocket.send(word)
      # await websocket.send(newstuff)
      time.sleep(1)

      laststuff = stuff

def stream():
  with io.open(filename, "wb") as writer:
    process = subprocess.Popen(["./stream"], cwd="../../whisper.cpp/", stdout=writer)

async def main():
  async with serve(echo, "localhost", 8765) as server:
    await server.serve_forever()

if __name__ == "__main__":
  streamer = threading.Thread(target=stream)
  streamer.start()
  asyncio.run(main())