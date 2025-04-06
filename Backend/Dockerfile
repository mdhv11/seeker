# Use official Python image
FROM python:3.10-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Use official CUDA base image
FROM nvidia/cuda:12.2.2-devel-ubuntu22.04

# System dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    python3.10-venv \
    build-essential \
    git \
    cmake \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Create virtual environment
RUN python3.10 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Build bitsandbytes from source
RUN git clone https://github.com/TimDettmers/bitsandbytes.git && \
    cd bitsandbytes && \
    CUDA_VERSION=121 make cuda12x && \
    python setup.py install && \
    cd .. && \
    rm -rf bitsandbytes

RUN echo "#!/bin/bash\npython app_startup.py\nexec \"\$@\"" > /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run the web service on container startup
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 300 app:app