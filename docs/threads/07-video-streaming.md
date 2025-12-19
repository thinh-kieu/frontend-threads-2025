---
nav: Threads
order: 7
---

# Video Streaming

One of the core features of a project I worked on this year was high-quality video streaming from multiple sources, along with synchronized recording. The goal was to ensure that, at a later point, users could scrub the timeline to any specific timestamp and view content from all sources accurately synchronized at that moment.

To support this streaming and recording workflow, we used [Socket.IO](https://socket.io/), [mediasoup](https://mediasoup.org/), and [FFmpeg](https://www.ffmpeg.org/).

Key scenarios:

- Streaming video from multiple sources to the client
- Recording streams into HLS, including selecting representative frames to generate thumbnails
- Detecting signal loss or service downtime during streaming and recording, and filling those gaps with static frames (black segments) to preserve timeline continuity
- Encrypting all recorded HLS assets and securely fetching decryption keys from the backend
- Requiring the video player to attach authentication headers and tokens to every request in order to access recorded sources

## Streaming workflow

- FFmpeg captures and ingests media sources into mediasoup via PlainTransport (using plain RTP/RTCP over UDP, without ICE/DTLS/SRTP).
- mediasoup acts as an SFU, receiving these streams as Producers and forwarding them to clients over WebRTC transports.
  - WebRTC transports rely on:
    - ICE to establish network connectivity across NATs and firewalls,
    - DTLS to perform secure handshake and key exchange,
    - and SRTP to encrypt and transport real-time media to consumers.
- Socket.IO is used exclusively for signaling and realtime control; all media flows are handled outside of Socket.IO.

Below is a sequence diagram that illustrates the video streaming flow.

![Video streaming sequence diagram](../assets/video-streaming.drawio.svg)

## Recording & encryption

## Synchronization

## Decrypt & authentication
