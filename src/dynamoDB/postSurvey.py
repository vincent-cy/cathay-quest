from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from datetime import datetime

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# --- AWS Configuration ---
AWS_REGION = 'ap-southeast-2'
DYNAMODB_TABLE_NAME = 'InitialSurvey'

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

@app.route('/api/save-survey', methods=['POST'])
def save_survey_result():
    """
    API endpoint to save a single survey result directly to DynamoDB in real-time.
    This is called immediately when a user completes the InitialSurvey.
    """
    try:
        # Get the survey data from the request
        survey_data = request.get_json()
        
        if not survey_data:
            return jsonify({"status": "error", "message": "No data provided"}), 400
        
        # Ensure required fields exist
        if 'userId' not in survey_data:
            survey_data['userId'] = f"USER_{datetime.now().isoformat()}"
        
        if 'timestamp' not in survey_data:
            survey_data['timestamp'] = datetime.now().isoformat()
        
        # Prepare item for DynamoDB (ensure all data types are DynamoDB-compatible)
        db_item = {
            'userId': survey_data['userId'],
            'timestamp': survey_data['timestamp'],
            'userName': survey_data.get('userName', 'Guest User'),
            'email': survey_data.get('email', 'user@example.com'),
            'completedAt': survey_data.get('completedAt', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
            'responses': survey_data.get('responses', {})
        }
        
        # Save directly to DynamoDB
        table.put_item(Item=db_item)
        
        print(f"Successfully saved survey result for user: {db_item['userId']} to DynamoDB")
        
        return jsonify({
            "status": "success",
            "message": "Survey result saved successfully",
            "userId": db_item['userId']
        }), 200
        
    except Exception as e:
        error_message = f"Error saving survey result: {str(e)}"
        print(error_message)
        return jsonify({
            "status": "error",
            "message": error_message
        }), 500

@app.route('/', methods=['GET'])
def root():
    """
    Root endpoint to show server is running.
    """
    return jsonify({
        "status": "running",
        "service": "DynamoDB Survey API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/save-survey": "Save a survey result to DynamoDB",
            "GET /health": "Health check"
        }
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify if the server is running.
    """
    return jsonify({
        "status": "healthy",
        "service": "DynamoDB Survey API",
        "version": "1.0.0"
    }), 200

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)