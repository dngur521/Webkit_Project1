# flask: 웹 서버를 위한 라이브러리
# request: HTTP 요청 데이터를 처리하기 위한 객체
from flask import Flask, request, jsonify
# serial: 아두이노와 시리얼 통신을 위한 라이브러리
import serial
import time
import sys
# mysql.connector: MySQL 데이터베이스 작업을 위한 라이브러리
import mysql.connector
# Adafruit_DHT: 온습도 센서 라이브러리
import Adafruit_DHT
# threading: 주기적인 작업을 위한 라이브러리
import threading

# 온습도 센서 설정
SENSOR_TYPE = Adafruit_DHT.DHT11
SENSOR_PIN = 26

# 아두이노 시리얼 포트와 전송 속도(Baud Rate) 설정
SERIAL_PORT = '/dev/ttyUSB0'
BAUD_RATE = 9600

# Flask 앱 생성
app = Flask(__name__)

# 아두이노로 명령을 전송하고 응답을 받습니다.
# 이 함수는 HTTP 요청을 처리하는 내부 로직입니다.
def send_command_to_arduino(command):
    ser = None
    try:
        # 시리얼 통신 객체 생성
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)  # 아두이노와의 연결이 안정될 때까지 잠시 대기

        # 명령어에 줄바꿈 문자('\n')를 추가하고, 바이트로 인코딩하여 전송
        ser.write(f'{command}\n'.encode('utf-8'))

        # 아두이노의 응답을 기다리기
        response = ser.readline().decode('utf-8').strip()
        return {"status": "success", "message": "Command sent to Arduino.", "arduinoResponse": response}

    except serial.SerialException as e:
        # 시리얼 포트 에러 발생 시
        return {"status": "error", "message": f"Error communicating with Arduino: {e}"}

    finally:
        if ser and ser.is_open:
            ser.close()

# 온습도 센서 데이터를 읽고 데이터베이스에 저장하는 함수
def read_and_save_dht_data():
    try:
        # 센서 데이터 읽기
        humidity, temperature = Adafruit_DHT.read_retry(SENSOR_TYPE, SENSOR_PIN)

        if humidity is not None and temperature is not None:
            # 데이터베이스에 저장
            conn = mysql.connector.connect(user='master', password='1234', host='localhost', database='aircon_data')
            cursor = conn.cursor()
            query = "INSERT INTO sensor_data (temperature, humidity, timestamp) VALUES (%s, %s, NOW())"
            cursor.execute(query, (temperature, humidity))
            conn.commit()
            cursor.close()
            conn.close()
            print(f"Sensor data saved: Temp={temperature}°C, Humidity={humidity}%")
        else:
            print("Failed to retrieve data from sensor. Retrying...")
    except Exception as e:
        print(f"Sensor read error: {e}")
    
    # 60초 후에 함수 다시 호출
    threading.Timer(60, read_and_save_dht_data).start()

# API 엔드포인트 정의
# 노트북의 Node.js 서버로부터 HTTP POST 요청을 받습니다.
@app.route('/arduino-command', methods=['POST'])
def handle_command():
    if not request.is_json:
        return jsonify({"status": "error", "message": "Request body must be JSON."}), 400

    data = request.get_json()
    command_to_send = data.get('command')

    if not command_to_send:
        return jsonify({"status": "error", "message": "The 'command' field is required."}), 400

    print(f"Received command from Node.js: {command_to_send}")

    # 아두이노로 명령 전송 및 응답 받기
    result = send_command_to_arduino(command_to_send)
    
    # 데이터베이스에 히스토리 삽입
    try:
        conn = mysql.connector.connect(user='master', password='1234', host='localhost', database='aircon_data')
        cursor = conn.cursor()
        query = "INSERT INTO history (command, response, timestamp) VALUES (%s, %s, NOW())"
        cursor.execute(query, (command_to_send, result.get('arduinoResponse', 'No response')))
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as e:
        print(f"Database error: {e}", file=sys.stderr)
        return jsonify({"status": "error", "message": "Database insertion failed."}), 500

    # 결과를 JSON 형식으로 반환
    return jsonify(result)

@app.route('/sensor-data', methods=['POST'])
def handle_sensor_data():
    if not request.is_json:
        return jsonify({"status": "error", "message": "Request body must be JSON."}), 400

    data = request.get_json()
    temperature = data.get('temperature')
    humidity = data.get('humidity')

    if temperature is None or humidity is None:
        return jsonify({"status": "error", "message": "Temperature and humidity fields are required."}), 400

    try:
        conn = mysql.connector.connect(user='master', password='1234', host='localhost', database='aircon_data')
        cursor = conn.cursor()
        query = "INSERT INTO sensor_data (temperature, humidity, timestamp) VALUES (%s, %s, NOW())"
        cursor.execute(query, (temperature, humidity))
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as e:
        print(f"Database error: {e}", file=sys.stderr)
        return jsonify({"status": "error", "message": "Database insertion failed."}), 500

    return jsonify({"status": "success", "message": "Sensor data saved successfully."})

@app.route('/dht-sensor', methods=['GET'])
def get_dht_sensor_data():
    # 센서 데이터를 읽는 함수를 직접 호출하여 실시간 데이터 반환
    try:
        humidity, temperature = Adafruit_DHT.read_retry(SENSOR_TYPE, SENSOR_PIN)
        if humidity is not None and temperature is not None:
            return jsonify({"temperature": temperature, "humidity": humidity, "status": "success"})
        else:
            return jsonify({"status": "error", "message": "Failed to retrieve data from sensor."}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": f"Sensor read error: {e}"}), 500


# 데이터베이스 히스토리 조회 API
@app.route('/history', methods=['GET'])
def get_history():
    try:
        conn = mysql.connector.connect(user='master', password='1234', host='localhost', database='aircon_data')
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM history ORDER BY timestamp DESC"
        cursor.execute(query)
        history_data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "data": history_data})
    except mysql.connector.Error as e:
        print(f"Database error: {e}", file=sys.stderr)
        return jsonify({"status": "error", "message": "Failed to retrieve history data."}), 500

# 센서 데이터 히스토리 조회 API
@app.route('/sensor-data-all', methods=['GET'])
def get_all_sensor_data():
    try:
        conn = mysql.connector.connect(user='master', password='1234', host='localhost', database='aircon_data')
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM sensor_data ORDER BY timestamp DESC"
        cursor.execute(query)
        sensor_data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "data": sensor_data})
    except mysql.connector.Error as e:
        print(f"Database error: {e}", file=sys.stderr)
        return jsonify({"status": "error", "message": "Failed to retrieve sensor data."}), 500

if __name__ == '__main__':
    try:
        # 데이터베이스 연결 및 테이블 생성
        conn = mysql.connector.connect(user='master', password='1234', host='localhost')
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS aircon_data")
        cursor.close()
        conn.close()
        
        conn = mysql.connector.connect(user='master', password='1234', host='localhost', database='aircon_data')
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                command VARCHAR(255) NOT NULL,
                response VARCHAR(255),
                timestamp DATETIME NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                temperature DECIMAL(5,2) NOT NULL,
                humidity DECIMAL(5,2) NOT NULL,
                timestamp DATETIME NOT NULL
            )
        ''')
        conn.commit()
        cursor.close()
        conn.close()
        print("Database 'aircon_data' and tables 'history' and 'sensor_data' initialized successfully.")
    except mysql.connector.Error as e:
        print(f"Error initializing database: {e}", file=sys.stderr)
        sys.exit(1)
        
    # 센서 데이터 수집 스레드 시작
    sensor_thread = threading.Thread(target=read_and_save_dht_data)
    sensor_thread.daemon = True # 메인 스레드 종료 시 함께 종료되도록 설정
    sensor_thread.start()

    # 서버를 모든 IP 주소에서 접근 가능하도록 '0.0.0.0'으로 설정
    app.run(host='0.0.0.0', port=5000, debug=True)
