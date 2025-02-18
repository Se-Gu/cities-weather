FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Initialize the database before starting Flask
CMD ["sh", "-c", "python init_db.py && flask run --host=0.0.0.0"]
