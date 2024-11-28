#!/usr/bin/env python

"""Echo server using the asyncio API."""

import asyncio
from websockets.asyncio.server import serve

import io
import time
import sys
import subprocess
import threading

filename = "test.log"

async def echo(websocket):
  with io.open(filename, "r", 1) as reader:
    async for message in websocket:
      stuff = reader.read()
      print(stuff)
      await websocket.send(stuff)

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