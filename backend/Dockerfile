# Python 3.10 tabanlı hafif bir imaj kullanıyoruz
FROM python:3.10-slim

# Docker içindeki çalışma dizinini ayarla
WORKDIR /app

# PostgreSQL bağlantısı için gerekli sistem kütüphanelerini kur
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Kütüphane listesini kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Tüm kodları konteyner içine kopyala
COPY . .

# FastAPI uygulamasını 8000 portundan dışarı açacak şekilde başlat
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]