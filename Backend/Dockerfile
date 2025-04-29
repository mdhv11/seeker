# Use official CUDA 12.2 runtime with Python 3.11 on Debian 12 (Bookworm)
FROM nvidia/cuda:12.2.2-runtime-ubuntu22.04

# Security hardening
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    build-essential \
    git \
    cmake \
    libcublas-12-2 \
    libcublas-dev-12-2 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create secure virtual environment
RUN python3.11 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \
    VIRTUAL_ENV="/opt/venv" \
    LD_LIBRARY_PATH="/usr/local/cuda/lib64:$LD_LIBRARY_PATH"

# Install security-patched dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -U pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt
# Install production server
RUN pip install waitress

# Add non-root user
RUN groupadd -r seeker && useradd -r -g seeker seeker
USER seeker
WORKDIR /app

# Copy application files
COPY --chown=seeker:seeker . .

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "8", "--timeout", "300", "app:app"]